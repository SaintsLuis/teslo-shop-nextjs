'use server'

import { PaypalOrderStatusResponse } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPaypalBearerToken()

  // console.log({ authToken })

  if (!authToken) {
    return {
      ok: false,
      message: 'No se pudo obtener el token de Paypal',
    }
  }

  const resp = await verifyPaypalPayment(paypalTransactionId, authToken)

  if (!resp) {
    return {
      ok: false,
      message: 'No se pudo verificar el pago de Paypal',
    }
  }

  const { status, purchase_units } = resp

  const { invoice_id: orderId } = purchase_units[0] // invoice id

  if (status !== 'COMPLETED') {
    return {
      ok: false,
      message: 'El pago no fue completado',
    }
  }

  // actualizar base de datos
  try {
    //console.log({ status, purchase_units })
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    })

    // revalidar path
    revalidatePath(`/orders/${orderId}`)

    return {
      ok: true,
    }
  } catch (error) {
    console.error('Error al actualizar la orden en la base de datos:', error)
    return {
      ok: false,
      message: '500 - El pago No se pudo realizar',
    }
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? ''

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64')

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
  myHeaders.append('Authorization', `Basic ${base64Token}`)

  const urlencoded = new URLSearchParams()
  urlencoded.append('grant_type', 'client_credentials')

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  }

  try {
    const result = await fetch(oauth2Url, {
      ...requestOptions,
      cache: 'no-store',
    }).then((r) => r.json())

    return result.access_token
  } catch (error) {
    console.error('Error al obtener el token de Paypal:', error)
    return null
  }
}

const verifyPaypalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PaypalOrderStatusResponse | null> => {
  const paypalOrderUrl = process.env.PAYPAL_ORDERS_URL

  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${bearerToken}`)

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  }

  try {
    const resp = await fetch(`${paypalOrderUrl}/${paypalTransactionId}`, {
      ...requestOptions,
      cache: 'no-store',
    }).then((r) => r.json())

    return resp
  } catch (error) {
    console.error('Error al verificar el pago de Paypal:', error)
    return null
  }
}
