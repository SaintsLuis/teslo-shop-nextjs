export const revalidate = 60 // Revalidate every 60 seconds

import { redirect } from 'next/navigation'
import { Pagination, ProductGrid, Title } from '@/components'
import { getPaginatedProductsWithImages } from '@/actions'
import { Gender } from '@prisma/client'

interface Props {
  params: Promise<{ gender: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function GenderPage({ params, searchParams }: Props) {
  const { gender } = await params
  const { page } = await searchParams

  // const page = searchParams.page ? parseInt(searchParams.page) : 1
  const pageNumber = page ? parseInt(page) : 1

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: pageNumber,
    gender: gender as Gender,
  })

  if (products.length === 0) {
    redirect(`/gender/${gender}`)
  }

  const labels: Record<string, string> = {
    men: 'para hombres',
    women: 'para mujeres',
    kid: 'para niños',
    unisex: 'para unisex',
  }

  // if (products.length === 0) {
  //   notFound()
  // }

  return (
    <>
      <Title
        title={`Articulos ${labels[gender]}`}
        subtitle='Todos los productos'
        className='mb-2'
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  )
}
