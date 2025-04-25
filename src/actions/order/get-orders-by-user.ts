'use server'

import prisma from '@/lib/prisma'
import { getSessionAction } from '../auth/auth-actions'

export const getOrdersByUser = async () => {
  // Obtener el usuario de la sesión
  const { session } = await getSessionAction()
  const userId = session?.user.id

  if (!userId) {
    return {
      ok: false,
      message: 'Debes iniciar sesión para ver tus órdenes',
    }
  }

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      OrderAddress: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  if (!orders) {
    return {
      ok: false,
      message: 'No se encontraron órdenes',
    }
  }

  return {
    ok: true,
    orders,
  }
}
