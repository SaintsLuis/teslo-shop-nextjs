'use server'

import type { Size, Address } from '@/interfaces'
import { getSessionAction } from '../auth/auth-actions'
import prisma from '@/lib/prisma'

interface ProductToOrder {
  productId: string
  quantity: number
  size: Size
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  // Obtener la sesión del usuario autenticado
  const { session } = await getSessionAction()
  const userId = session?.user.id

  if (!userId) {
    return {
      ok: false,
      message: 'No se pudo realizar el pedido',
    }
  }

  // console.log({ productIds, address, userId })

  // Obtener la informacion de los productos
  // Nota: recuerden que podemos llevar 2+ productos con el mismo ID

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((product) => product.productId),
      },
    },
  })

  // Calcular los montos
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)

  // Los totales de tax, subtotal, y el total
  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity

      const product = products.find((product) => product.id === item.productId)

      if (!product) throw new Error('Producto no encontrado')

      const subTotal = product.price * productQuantity
      totals.subTotal += subTotal
      totals.tax += subTotal * 0.18
      totals.total += subTotal * 1.18

      return totals
    },
    { subTotal: 0, tax: 0, total: 0 }
  )

  // Crear la transaccion de base de datos, Si una sola cosa falla, la transaccion se revierte y no continua
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        // Acumular los valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0)

        if (productQuantity === 0)
          throw new Error(`El producto ${product.title} no existe`)

        return tx.product.update({
          where: { id: product.id },
          data: {
            // inStock: product.inStock - productQuantity, // no hacer
            inStock: {
              decrement: productQuantity,
            },
          },
        })
      })

      const updatedProducts = await Promise.all(updatedProductsPromises)

      // Verificar valores negativos en las existencia = no hay stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(
            `El producto ${product.title} no tiene inventario suficiente`
          )
        }
      })

      // 2. Crear la orden - Encabezado - Detalles
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      })

      // Validar, si el price es cero, entonces lanzar un error

      // 3. Crear la direccion de la orden
      // Address
      const { country, ...restAddress } = address
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id,
        },
      })

      return {
        updatedProducts: updatedProducts,
        order: order,
        orderAddress: orderAddress,
      }
    })

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : 'Error al crear la orden',
    }
  }
}
