import { getOrderById } from '@/actions/order/get-order-by-id'
import { OrderStatus, PaypalButton, ProductImage, Title } from '@/components'
import { currencyFormat } from '@/utils'

import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderByIdPage({ params }: Props) {
  const { id } = await params

  //server action
  const { ok, order } = await getOrderById(id)

  if (!ok) {
    redirect('/')
  }

  const address = order!.OrderAddress

  return (
    <div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title={`Orden #${id.split('-').at(-1)}`} />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {/* Carrito */}
          <div className='flex flex-col mt-5'>
            <OrderStatus isPaid={order?.isPaid ?? false} />

            {/* Items */}
            {order!.OrderItem.map((item) => (
              <div
                key={item.product.slug + '-' + item.size}
                className='flex mb-5'
              >
                <ProductImage
                  src={item.product.ProductImage[0].url}
                  width={100}
                  height={100}
                  alt={item.product.title}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  className='mr-5 rounded'
                />

                <div>
                  <p>{item.product.title}</p>
                  <p>
                    {currencyFormat(item.price)} x {item.quantity}
                  </p>
                  <p className='font-bold'>
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout - Resumen de orden */}
          <div className='bg-white rounded-xl shadow-xl p-7 mb-10'>
            <h2 className='text-2xl mb-2 '>Direccion de entrega</h2>

            <div className='mb-10'>
              <p>{address!.firstName}</p>
              <p>{address!.lastName}</p>
              <p>{address!.address}</p>
              <p>{address!.address2} </p>
              <p>{address!.city}</p>
              <p>{address!.postalCode}</p>
              <p>{address!.phone}</p>
              <p>{address!.countryId}</p>
            </div>

            <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />

            <h2 className='text-2xl mb-2'>Resumen de orden</h2>

            <div className='grid grid-cols-2'>
              <span>No. Productos</span>
              <span className='text-right'>
                {order?.itemsInOrder === 1
                  ? '1 articulo'
                  : `${order?.itemsInOrder} articulos`}
              </span>

              <span>Subtotal</span>
              <span className='text-right'>
                {currencyFormat(order!.subTotal)}
              </span>

              <span>Impuestos(18%)</span>
              <span className='text-right'>{currencyFormat(order!.tax)}</span>

              <span className='mt-5 text-2xl'>Total:</span>
              <span className='mt-5 text-2xl text-right'>
                {currencyFormat(order!.total)}
              </span>
            </div>

            {/* Botones de Paypal o Order Status */}
            <div className='mt-5 mb-2 w-full'>
              {order?.isPaid ? (
                <OrderStatus isPaid={order?.isPaid ?? false} />
              ) : (
                <PaypalButton amount={order!.total} orderId={order!.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
