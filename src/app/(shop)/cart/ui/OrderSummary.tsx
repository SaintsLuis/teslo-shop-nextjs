'use client'

import { useCartStore } from '@/store'
import { currencyFormat } from '@/utils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'

export const OrderSummary = () => {
  const router = useRouter()

  // useShallow is used to prevent unnecessary re-renders
  // by only updating the component when the selected state changes
  const { numberOfItems, subtotal, tax, total } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  )

  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  // Check if the cart is empty, if so go to '/empty'
  useEffect(() => {
    if (numberOfItems === 0 && typeof window !== 'undefined') {
      router.replace('/empty')
    }
  }, [numberOfItems, router])

  return (
    <>
      <span>No. Productos</span>
      <span className='text-right'>
        {numberOfItems === 1 ? '1 articulo' : `${numberOfItems} articulos`}
      </span>

      <span>Subtotal</span>
      <span className='text-right'>{currencyFormat(subtotal)}</span>

      <span>Impuestos(18%)</span>
      <span className='text-right'>{currencyFormat(tax)}</span>

      <span className='mt-5 text-2xl'>Total:</span>
      <span className='mt-5 text-2xl text-right'>{currencyFormat(total)}</span>
    </>
  )
}
