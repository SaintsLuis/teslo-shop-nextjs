'use server'

import prisma from '@/lib/prisma'

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return categories
  } catch (error) {
    console.error('Error get categories', error)
    return []
  }
}
