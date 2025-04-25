'use client'

import { placeOrder } from '@/actions/order/place-order'
import { useAddressStore, useCartStore } from '@/store'
import { currencyFormat } from '@/utils'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'

export const PlaceOrder = () => {
  const router = useRouter()

  // store
  const addressStore = useAddressStore((state) => state.address)
  const { numberOfItems, subtotal, tax, total } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  )
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // skipHydration: true zustand
  useEffect(() => {
    useAddressStore.persist.rehydrate()
    useCartStore.persist.rehydrate()
  }, [])

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true)

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      size: product.size,
      quantity: product.quantity,
    }))

    // server action
    const resp = await placeOrder(productsToOrder, addressStore)

    if (!resp.ok) {
      setIsPlacingOrder(false)
      setErrorMessage(resp.message!)
      return
    }

    //* todo salio bien

    clearCart()

    router.replace(`/orders/${resp.order!.id}`)
  }

  const {
    firstName,
    lastName,
    address,
    address2,
    city,
    country,
    phone,
    postalCode,
  } = addressStore

  return (
    <>
      <div className='bg-white rounded-xl shadow-xl p-7'>
        <h2 className='text-2xl mb-2 '>Direccion de entrega</h2>

        <div className='mb-10'>
          <p>{firstName}</p>
          <p>{lastName}</p>
          <p>{address}</p>
          <p>{address2} </p>
          <p>{city}</p>
          <p>{postalCode}</p>
          <p>{phone}</p>
          <p>{country}</p>
        </div>

        <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />

        <h2 className='text-2xl mb-2'>Resumen de orden</h2>

        <div className='grid grid-cols-2'>
          <span>No. Productos</span>
          <span className='text-right'>
            {numberOfItems === 1 ? '1 articulo' : `${numberOfItems} articulos`}
          </span>

          <span>Subtotal</span>
          <span className='text-right'>{currencyFormat(subtotal)}</span>

          <span>Impuestos(18%)</span>
          <span className='text-right'>{currencyFormat(tax)}</span>

          <span className='mt-5 text-2xl'>Total:</span>
          <span className='mt-5 text-2xl text-right'>
            {currencyFormat(total)}
          </span>
        </div>

        <div className='mt-5 mb-2 w-full'>
          <p className='mb-5'>
            {/* Disclainer */}
            <span className='text-xs'>
              Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestos{' '}
              <a href='#' className='underline'>
                terminos y condiciones
              </a>{' '}
              y{' '}
              <a href='#' className='underline'>
                politica de privacidad
              </a>
              .
            </span>
          </p>

          {/*  */}
          <p className='text-red-500'>{errorMessage}</p>

          <button
            onClick={onPlaceOrder}
            className={clsx({
              'btn-primary': !isPlacingOrder,
              'btn-disabled': isPlacingOrder,
            })}
            // href={'/orders/123'}
          >
            Colocar orden
          </button>
        </div>
      </div>
    </>
  )
}
