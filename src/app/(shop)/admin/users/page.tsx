export const dynamic = 'force-dynamic'

import { getPaginatedUsers } from '@/actions/users/get-paginater-users'
import { UsersTable } from './ui/UsersTable'
import { Pagination, Title } from '@/components'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
  const { ok, users } = await getPaginatedUsers()

  if (!ok) {
    redirect('auth/sign-in')
  }

  return (
    <>
      <Title title='Mantenimiento de Usuarios' />
      <div className='mb-10'>
        <UsersTable users={users ?? []} />

        <Pagination totalPages={1} />
      </div>
    </>
  )
}
