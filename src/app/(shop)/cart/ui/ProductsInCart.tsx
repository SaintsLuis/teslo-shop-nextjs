'use client'

import { useCartStore } from '@/store'
import { ProductImage, QuantitySelector } from '@/components'
import { useEffect } from 'react'
import Link from 'next/link'

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart)
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  )
  const removeProductFromCart = useCartStore(
    (state) => state.removeProductFromCart
  )

  // skipHydration: true zustand
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  return (
    <>
      {productsInCart.map((product) => (
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
            <Link
              className='hover:underline hover:cursor-pointer'
              href={`/product/${product.slug}`}
            >
              {product.size} - {product.title}
            </Link>

            <p>${product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChanged={(quantity) =>
                updateProductQuantity(product, quantity)
              }
            />

            <button
              onClick={() => removeProductFromCart(product)}
              className='underline mt-3 cursor-pointer'
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
