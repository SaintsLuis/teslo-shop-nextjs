'use server'

// Utilizando mi api route en /app/api/product/stock/[slug]/route.ts
// para obtener el stock de un producto en caliente y que no este en cache

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    // Construcción de URL absoluta para llamadas desde el servidor
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host =
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      'localhost:3000'
    const url = `${protocol}://${host}/api/product/stock/${slug}`

    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Error fetching stock')
    }

    const data = await response.json()
    return data.stock
  } catch (error) {
    console.error('Error fetching stock:', error)
    return 0
  }
}
