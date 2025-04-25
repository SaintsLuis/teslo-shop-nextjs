'use server'

import prisma from '@/lib/prisma'
import { getSessionAction } from '../auth/auth-actions'

export const getPaginatedUsers = async () => {
  const { session } = await getSessionAction()
  const userRole = session?.user.role

  if (userRole !== 'admin') {
    return {
      ok: false,
      message: 'No tienes permisos para ver esta página',
    }
  }

  const users = await prisma.user.findMany({
    orderBy: {
      name: 'desc',
    },
  })

  return {
    ok: true,
    users,
  }
}
