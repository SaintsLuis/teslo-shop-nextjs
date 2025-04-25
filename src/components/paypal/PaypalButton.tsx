'use client'

import { setTransactionId } from '@/actions/payments/set-transaction-id'
import { paypalCheckPayment } from '@/actions/payments/paypal-check-payment'
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'

interface Props {
  orderId: string
  amount: number
}

export const PaypalButton = ({ amount, orderId }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer()

  const rountedAmount = (Math.round(amount * 100) / 100).toFixed(2)

  if (isPending) {
    return (
      <div className='animate-pulse mb-10'>
        <div className='h-11 bg-gray-200 rounded' />
        <div className='h-11 mt-2 bg-gray-200 rounded' />
      </div>
    )
  }

  const createOrder: PayPalButtonsComponentProps['createOrder'] = async (
    data,
    actions
  ) => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: 'USD',
            value: `${rountedAmount}`,
          },
        },
      ],
      intent: 'CAPTURE',
    })

    // console.log('Transaction ID:', transactionId)

    // call server action
    const { ok } = await setTransactionId(orderId, transactionId)

    if (!ok) {
      throw new Error('No se pudo guardar la orden')
    }

    return transactionId
  }

  const onApprove: PayPalButtonsComponentProps['onApprove'] = async (
    data,
    actions
  ) => {
    const details = await actions.order?.capture()
    //console.log('Transaction details:', details)

    if (!details) {
      throw new Error('No se pudo completar la transacción')
    }

    if (!details.id) {
      throw new Error('Transaction ID is missing')
    }

    // call server action

    await paypalCheckPayment(details.id)
  }

  return (
    <>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </>
  )
}
