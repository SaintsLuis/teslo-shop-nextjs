import { betterAuth } from 'better-auth'

import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from '@/lib/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  pages: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
  },
  plugins: [nextCookies(), admin()],
})
