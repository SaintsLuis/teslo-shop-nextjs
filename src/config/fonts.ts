import { Inter, Montserrat_Alternates } from 'next/font/google'

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const titleFont = Montserrat_Alternates({
  variable: '--font-title',
  subsets: ['latin'],
  weight: ['500', '700'],
})
