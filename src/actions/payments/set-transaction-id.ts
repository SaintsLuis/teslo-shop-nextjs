'use server'

import prisma from '@/lib/prisma'

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId: transactionId,
      },
    })

    if (!order) {
      return {
        ok: false,
        message: 'No se encontró la orden',
      }
    }

    return {
      ok: true,
    }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el transactionId',
    }
  }
}
