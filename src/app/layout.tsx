import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { inter } from '@/config/fonts'
import { Providers } from '@/components'

export const metadata: Metadata = {
  title: {
    template: '%s | Teslo Shop',
    default: 'Teslo Shop',
  },
  description: 'Teslo Shop - Shop for the best Teslo products',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
