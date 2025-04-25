'use client'

import { useCartStore } from '@/store'

import { useEffect } from 'react'

import { currencyFormat } from '@/utils'
import { ProductImage } from '@/components'

export const ProductsInCheckout = () => {
  // store
  const productsInCheckout = useCartStore((state) => state.cart)

  // skipHydration: true zustand
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  return (
    <>
      {productsInCheckout.map((product) => (
        <div key={`${product.slug}-${product.size}`} className='flex mb-5'>
          <ProductImage
            src={product.images}
            width={100}
            height={100}
            alt={product.title}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            className='mr-5 rounded'
          />

          <div>
            <span className=''>
              {product.size} - {product.title} ({product.quantity})
            </span>

            <p className='font-bold'>
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  )
}
