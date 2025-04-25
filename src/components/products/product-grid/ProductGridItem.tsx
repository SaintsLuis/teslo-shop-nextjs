'use client'

import { ProductImage } from '@/components/product/product-image/ProductImage'
import { Product } from '@/interfaces'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  product: Product
}

export const ProductGridItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0])

  const handleMouseEnter = (image?: string) => {
    if (image) setDisplayImage(image)
  }

  return (
    <div className='rounded-md overflow-hidden fade-in'>
      <Link href={`/product/${product.slug}`}>
        <ProductImage
          src={displayImage}
          alt={product.title}
          className='w-full object-cover rounded transition-all duration-300 ease-in-out hover:scale-105'
          width={500}
          height={500}
          onMouseEnter={() => handleMouseEnter(product.images[1])}
          onMouseLeave={() => handleMouseEnter(product.images[0])}
        />
      </Link>

      <div className='p-4 flex flex-col '>
        <Link className='hover:text-blue-600' href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className='font-bold'>${product.price}</span>
      </div>
    </div>
  )
}
