'use client'

import { QuantitySelector, SizeSelector } from '@/components'
import { CartProduct, Product, Size } from '@/interfaces'
import { useCartStore } from '@/store'

import { useState } from 'react'

interface Props {
  product: Product
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart)

  const [size, setSize] = useState<Size | undefined>()
  const [quantity, setQuantity] = useState<number>(1)
  const [posted, setPosted] = useState(false)

  const onSizeChanged = (newSize: Size) => {
    setSize(newSize)
  }

  const addToCart = () => {
    setPosted(true)

    if (!size) return

    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      size,
      quantity,
      images: product.images[0],
    }

    // Agrega el producto al carrito
    addProductToCart(cartProduct)

    // Reinicia el estado
    setPosted(false)
    setSize(undefined)
    setQuantity(1)
  }

  return (
    <>
      {posted && !size && (
        <span className='mt-2 text-red-400 fade-in'>
          Debe de seleccionar una talla
        </span>
      )}

      {/* Selector de tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={(size) => onSizeChanged(size)}
      />

      {/* Selector de cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      {/* Button */}
      <button
        className='btn-primary my-5 hover:cursor-pointer'
        onClick={addToCart}
      >
        Agregar al carrito
      </button>
    </>
  )
}
