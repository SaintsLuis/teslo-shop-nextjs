'use server'

import prisma from '@/lib/prisma'
import { getSessionAction } from '../auth/auth-actions'

export const getPaginatedOrders = async () => {
  // Obtener el usuario de la sesión
  const { session } = await getSessionAction()
  const userRole = session?.user.role

  if (userRole !== 'admin') {
    return {
      ok: false,
      message: 'Debes iniciar sesión para ver tus órdenes',
    }
  }

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
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
