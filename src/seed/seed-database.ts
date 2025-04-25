import { initialData } from './seed'
import prisma from '../lib/prisma'
import { Size, Gender } from '@prisma/client'
import { countries } from './seed-countries'

async function main() {
  // 1. Delete all data previous
  await prisma.orderAddress.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.userAddress.deleteMany()
  await prisma.country.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const { products, categories } = initialData

  // 2. Paises
  await prisma.country.createMany({
    data: countries,
  })

  // 2. Categorias
  const categoriesData = categories.map((name) => ({ name }))

  await prisma.category.createMany({
    data: categoriesData,
  })

  const categoriesDB = await prisma.category.findMany()

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id
    return map
  }, {} as Record<string, string>)

  // 3. Productos - usamos for...of para manejar async/await correctamente
  for (const product of products) {
    const { type, images, sizes, gender, ...rest } = product

    console.log(`Creando: ${product.title}`)

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        sizes: sizes as Size[],
        gender: gender as Gender,
        categoryId: categoriesMap[type],
      },
    })

    // 4. Imágenes
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }))

    await prisma.productImage.createMany({
      data: imagesData,
    })
  }

  console.log('Seed ejecutado correctamente 🌱')
}

;(() => {
  if (process.env.NODE_ENV === 'production') return

  main().catch((error) => {
    console.error('Error en seed:', error)
    process.exit(1)
  })
})()
