export interface CreateUpdateProductSuccessResponse {
  ok: true
  product: {
    tags: string[]
    id: string
    title: string
    slug: string
    description: string
    price: number
    inStock: number
    categoryId: string
    sizes: string[]
    gender: 'men' | 'women' | 'kid' | 'unisex'
  }
}

export interface CreateUpdateProductErrorResponse {
  ok: false
  error?: unknown
  message?: string
}

export type CreateUpdateProductResponse =
  | CreateUpdateProductSuccessResponse
  | CreateUpdateProductErrorResponse
