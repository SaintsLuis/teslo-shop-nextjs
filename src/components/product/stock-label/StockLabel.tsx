'use client'

import { getStockBySlug } from '@/actions/products/get-stock-by-slug'
import { titleFont } from '@/config/fonts'
import { useEffect, useState } from 'react'

interface Props {
  slug: string
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStock = async () => {
      try {
        // Llamada a la Server Action
        const stockValue = await getStockBySlug(slug)
        setStock(stockValue)
        setIsLoading(false)
      } catch (error) {
        console.error('Error al obtener el stock:', error)
        setIsLoading(false)
      }
    }
    fetchStock()
  }, [slug])

  if (isLoading) {
    return (
      <h1
        className={`${titleFont.className} antialiased font-bold text-xl animate-pulse bg-gray-200 rounded-md w-24`}
      >
        &nbsp;
      </h1>
    )
  }

  return (
    <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
      Stock: {stock}
    </h1>
  )
}
