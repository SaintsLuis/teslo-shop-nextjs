'use server'

import { revalidatePath } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Gender, Size } from '@prisma/client'
import { Readable } from 'stream'
import { CreateUpdateProductResponse } from '@/interfaces'

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Esquema de validación con Zod
const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3, 'El título es requerido').max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Math.floor(val)),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(',')),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
})

// Función principal para crear/actualizar productos
export const createUpdateProduct = async (
  formData: FormData
): Promise<CreateUpdateProductResponse> => {
  const data = Object.fromEntries(formData.entries())

  // Validación de datos con Zod
  const parsedData = productSchema.safeParse(data)
  if (!parsedData.success) {
    console.error('Validation error:', parsedData.error.format())
    return {
      ok: false,
      error: parsedData.error.format(),
    }
  }

  const product = parsedData.data
  product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim()

  const { id, ...productToSave } = product

  // Proceso de carga y guardado de imágenes
  let imageUrls: string[] = []

  if (formData.getAll('images')) {
    const uploadedImages = await uploadImages(
      formData.getAll('images') as File[]
    )
    if (!uploadedImages) {
      return {
        ok: false,
        message: 'Error uploading images, please try again',
      }
    }
    imageUrls = uploadedImages
  }

  try {
    // Transacción de Prisma
    const prismaTx = await prisma.$transaction(async (tx) => {
      const tagsArray = productToSave.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())

      if (id) {
        // Actualizar producto existente
        const updatedProduct = await tx.product.update({
          where: { id },
          data: {
            ...productToSave,
            sizes: { set: productToSave.sizes as Size[] },
            tags: { set: tagsArray },
          },
        })

        // Asociar imágenes al producto
        if (imageUrls.length > 0) {
          await tx.productImage.createMany({
            data: imageUrls.map((url) => ({
              url,
              productId: updatedProduct.id,
            })),
          })
        }

        return {
          ok: true,
          product: {
            ...updatedProduct,
            tags: tagsArray,
          },
        }
      } else {
        // Crear nuevo producto
        const createdProduct = await tx.product.create({
          data: {
            ...productToSave,
            sizes: { set: productToSave.sizes as Size[] },
            tags: { set: tagsArray },
          },
        })

        // Asociar imágenes al producto
        if (imageUrls.length > 0) {
          await tx.productImage.createMany({
            data: imageUrls.map((url) => ({
              url,
              productId: createdProduct.id,
            })),
          })
        }

        return {
          ok: true,
          product: {
            ...createdProduct,
            tags: tagsArray,
          },
        }
      }
    })

    // Revalidar rutas en Next.js
    revalidatePath(`/admin/products`)
    revalidatePath(`/admin/product/${product.slug}`)
    revalidatePath(`/products/${product.slug}`)

    return prismaTx
  } catch (error) {
    console.error('Error in transaction:', error)
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : 'Error 500 - Internal Server Error',
    }
  }
}

// Función para subir imágenes a Cloudinary
const uploadImages = async (images: File[]): Promise<string[]> => {
  try {
    const uploadPromises = images.map(async (image) => {
      const buffer = await image.arrayBuffer()

      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'teslo-shop' }, // Opcional: carpeta en Cloudinary
          (error, result) => {
            if (error) {
              console.error('Error uploading image:', error)
              return reject(error)
            }
            resolve(result?.secure_url || '')
          }
        )

        Readable.from(Buffer.from(buffer)).pipe(uploadStream)
      })
    })

    const uploadedImages = await Promise.all(uploadPromises)
    return uploadedImages.filter((url) => url !== null)
  } catch (error) {
    console.error('Error uploading images:', error)
    return [] // Devuelve un array vacío en caso de error
  }
}
