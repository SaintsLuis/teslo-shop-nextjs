'use server'

import prisma from '@/lib/prisma'
import { getSessionAction } from '../auth/auth-actions'
import { revalidatePath } from 'next/cache'

export const changeUserRole = async (userId: string, role: string) => {
  const { session } = await getSessionAction()
  const userRole = session?.user.role

  if (userRole !== 'admin') {
    return {
      ok: false,
      message: 'No tienes permisos para ver esta página',
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    })

    revalidatePath('/admin/users')

    return {
      ok: true,
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Error desconocido - 500',
    }
  }
}
