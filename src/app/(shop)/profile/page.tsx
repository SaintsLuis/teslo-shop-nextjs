import { Title } from '@/components'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    // Puedes redirigir o mostrar un mensaje si no hay sesión
    redirect('/auth/sign-in?returnTo=/profile')
  }

  const user = session.user

  return (
    <>
      <Title title='Perfil' />
      <div className='p-4'>
        <p>
          <strong>Nombre:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {user.role}
        </p>
      </div>
    </>
  )
}
