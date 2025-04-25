import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const stock = await prisma.product.findFirst({
      where: { slug },
      select: { inStock: true },
    })

    return Response.json({ stock: stock?.inStock ?? 0 })
  } catch (error) {
    console.error('Error fetching stock:', error)
    return Response.json({ stock: 0 }, { status: 500 })
  }
}
