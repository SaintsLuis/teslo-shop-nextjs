'use server'

import prisma from '@/lib/prisma'
import { Gender } from '@prisma/client'

interface PaginationOptions {
  page?: number
  take?: number
  gender?: Gender
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  // Validate page and take
  if (isNaN(Number(page))) page = 1
  if (page < 1) page = 1

  try {
    // 1. Obtener los productos
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      // Filtrar por genero
      where: {
        gender: gender,
      },
    })

    // 2. Obtener el total de paginas
    const totalCount = await prisma.product.count({
      where: {
        gender: gender,
      },
    })
    const totalPages = Math.ceil(totalCount / take)

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    }
  } catch (error) {
    console.log(error)
    throw new Error('Error fetching products')
  }
}
