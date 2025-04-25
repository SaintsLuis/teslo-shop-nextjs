export const revalidate = 10080 // 7 days

import { getProductBySlug } from '@/actions'
import {
  ProductMobileSlideshow,
  ProductSlideshow,
  StockLabel,
} from '@/components'
import { titleFont } from '@/config/fonts'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { AddToCart } from './ui/AddToCart'
// import { Metadata, ResolvingMetadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

// Metadata Dynamica
export async function generateMetadata({
  params,
}: Props): // parent: ResolvingMetadata
Promise<Metadata> {
  // Lee el parámetro slug
  const { slug } = await params

  // Obtiene los datos del producto
  const product = await getProductBySlug(slug)

  // Si no hay producto, devuelve metadata por defecto
  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no está disponible',
    }
  }

  // Opcionalmente, accede a las imágenes del padre
  //const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    description: product.description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    ),
    openGraph: {
      title: product.title,
      description: product.description,
      images: [`/products/${product.images[1]}`],
      // images: [
      //   ...product.images.map((image) => ({
      //     url: image,
      //     width: 1200,
      //     height: 630,
      //   })),
      //   ...previousImages,
      // ],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className='mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3'>
      {/* Slideshow */}
      <div className='col-span-1 md:col-span-2'>
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className='block md:hidden'
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className='hidden md:block'
        />
      </div>

      {/* Detalles */}
      <div className='col-span-1 px-5 '>
        {/* Stock (solo esto En caliente) */}
        <StockLabel slug={product.slug} />

        {/* Titulo */}
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className='text-lg mb-5'>${product.price}</p>

        {/* Add To Cart */}
        <AddToCart product={product} />

        {/* Descripcion */}
        <h3 className='font-bold text-sm'>Descripcion</h3>
        <p className='font-light'>{product.description}</p>
      </div>
    </div>
  )
}
