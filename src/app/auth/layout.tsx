import { auth } from '@/lib'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Si ya tengo una sesión, redirigir a la página de inicio
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect('/')
  }

  return (
    <main className='flex justify-center'>
      <div className='w-full sm:w-[500px] px-10'>{children}</div>
    </main>
  )
}
