'use client'

import { useUIStore } from '@/store'
import clsx from 'clsx'
import Link from 'next/link'
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5'
import { authClient } from '@/lib/auth-client'

export const Sidebar = () => {
  const { isSideMenuOpen, closeSideMenu } = useUIStore((state) => state)

  // Usar la API del cliente de Better Auth
  const session = authClient.useSession()
  const isAuthenticated = !!session.data

  const userName = session.data?.user.name
  const userRole = session.data?.user.role

  const handleLogout = async () => {
    await authClient.signOut()
    closeSideMenu()
  }

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className='fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30' />
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeSideMenu}
          className='fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm'
        />
      )}

      {/* Sidemenu */}
      <nav
        className={clsx(
          'fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300',
          {
            'translate-x-full': !isSideMenuOpen,
          }
        )}
      >
        {/* */}
        <h2 className='text-xl font-bold mt-5 absolute top-0 left-5 right-0'>
          {isAuthenticated ? `👋 Hola, ${userName}` : ''}
        </h2>

        <IoCloseOutline
          size={40}
          className='absolute top-5 right-5 cursor-pointer'
          onClick={closeSideMenu}
        />

        {/* Input Search */}
        <div className='relative mt-14'>
          <IoSearchOutline size={20} className='absolute top-2 left-2' />
          <input
            type='text'
            placeholder='Buscar'
            className='w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-lg border-gray-200 focus:outline-none focus:border-blue-500'
          />
        </div>

        {/* Menu */}
        {isAuthenticated && (
          <>
            <Link
              href={'/profile'}
              onClick={closeSideMenu}
              className='flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all duration-300'
            >
              <IoPersonOutline size={25} />
              <span className='ml-3 text-lg'>Perfil</span>
            </Link>
            <Link
              href={'/orders'}
              onClick={closeSideMenu}
              className='flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all duration-300'
            >
              <IoTicketOutline size={25} />
              <span className='ml-3 text-lg'>Mis Ordenes</span>
            </Link>
          </>
        )}

        {/* Si esta Autenticado */}
        {isAuthenticated ? (
          <Link
            href={'/'}
            onClick={handleLogout}
            className='flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all duration-300'
          >
            <IoLogOutOutline size={25} />
            <span className='ml-3 text-lg'>Salir</span>
          </Link>
        ) : (
          <Link
            href={'/auth/sign-in'}
            onClick={closeSideMenu}
            className='flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all duration-300'
          >
            <IoLogInOutline size={25} />
            <span className='ml-3 text-lg'>Ingresar</span>
          </Link>
        )}

        {/* Administracion menu (solo si es admin) */}
        {isAuthenticated && userRole === 'admin' && (
          <>
            {/* Line separator */}
            <div className='w-full h-[1px] bg-gray-200 my-10' />

            {/* Admin menu */}
            <h3 className='text-lg font-bold'>Administración</h3>
            <Link
              href={'/admin/products'}
              onClick={closeSideMenu}
              className='flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all duration-300'
            >
              <IoShirtOutline size={25} />
              <span className='ml-3 text-lg'>Productos</span>
            </Link>
            <Link
              href={'/admin/orders'}
              onClick={closeSideMenu}
              className='flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all duration-300'
            >
              <IoTicketOutline size={25} />
              <span className='ml-3 text-lg'>Ordenes</span>
            </Link>
            <Link
              href={'/admin/users'}
              onClick={closeSideMenu}
              className='flex items-center mt-6 p-2 hover:bg-gray-100 rounded transition-all duration-300'
            >
              <IoPeopleOutline size={24} />
              <span className='ml-3 text-lg'>Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
