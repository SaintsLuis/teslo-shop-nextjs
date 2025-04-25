'use server'

import prisma from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'
import { revalidatePath } from 'next/cache'

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      error: 'No se pueden eliminar imagenes de FS',
    }
  }
  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? ''

  try {
    // Eliminar la imagen de Cloudinary
    await cloudinary.uploader.destroy(`teslo-shop/${imageName}`)

    //Eliminar la imagen de la base de datos
    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        Product: {
          select: {
            slug: true,
          },
        },
      },
    })

    // revalidar paths
    revalidatePath(`/admin/products`)
    revalidatePath(`/admin/product/${deletedImage.Product.slug}`)
    revalidatePath(`/product/${deletedImage.Product.slug}`)

    return {
      ok: true,
    }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error)
    return {
      ok: false,
      error: 'Error al eliminar la imagen',
    }
  }
}
