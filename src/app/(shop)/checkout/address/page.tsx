export const dynamic = 'force-dynamic'

import { Title } from '@/components'

import { AddressForm } from './ui/AddressForm'
import { getCountries, getSessionAction, getUserAddress } from '@/actions'
import { redirect } from 'next/navigation'

export default async function AddressPage() {
  // Obtener la sesión del usuario autenticado
  const { session } = await getSessionAction()
  const userId = session?.user.id

  // Si no hay sesión, redirigir al usuario a la página de inicio de sesión
  if (!userId) {
    redirect('/auth/sign-in')
  }

  // Obtener la lista de países
  const countries = await getCountries()

  // Obtener la dirección del usuario autenticado
  const userAddress = (await getUserAddress(userId)) ?? undefined
  //console.log(userAddress)

  return (
    <div className='flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0'>
      <div className='w-full xl:w-[1000px] flex flex-col justify-center text-left'>
        <Title title='Dirección' subtitle='Dirección de entrega' />

        <AddressForm
          userId={userId}
          countries={countries}
          userStoredAddress={userAddress}
        />
      </div>
    </div>
  )
}
