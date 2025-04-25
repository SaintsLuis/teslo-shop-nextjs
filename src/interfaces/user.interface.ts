// Be

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string | Date
  updatedAt: string | Date
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: string | Date | null
}
