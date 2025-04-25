import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger rutas solo para autenticados
  if (
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/users')
  ) {
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/:path*', '/profile/:path*', '/admin/:path*'],
}
