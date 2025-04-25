'use server'

import prisma from '@/lib/prisma'
import { getSessionAction } from '../auth/auth-actions'

export const getOrderById = async (orderId: string) => {
  // Obtener el usuario de la sesión
  const { session } = await getSessionAction()
  const userId = session?.user.id
  const userRole = session?.user.role

  if (!userId) {
    return {
      ok: false,
      message: 'Debes iniciar sesión para ver tus órdenes',
    }
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,

                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    })

    if (!order) {
      throw new Error(`No se encontró la orden con id ${orderId}`)
    }

    // El admin puede ver todas las órdenes, el usuario solo las suyas
    if (userRole === 'user') {
      if (order.userId !== userId) {
        throw new Error(`La orden ${orderId} no pertenece a este usuario`)
      }
    }

    return {
      ok: true,
      order,
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Error desconocido - 500',
    }
  }
}
