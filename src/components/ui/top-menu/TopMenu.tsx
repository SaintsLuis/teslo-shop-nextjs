'use client'

import { titleFont } from '@/config/fonts'
import { useCartStore, useUIStore } from '@/store'
import Link from 'next/link'
import { useEffect } from 'react'
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5'

export const TopMenu = () => {
  const { openSideMenu } = useUIStore((state) => state)
  const totalItemsInCart = useCartStore((state) => state.getTotalItems())

  // Resolver el problema de hidratación solucion 1
  // const [loaded, setLoaded] = useState(false)
  // useEffect(() => {
  //   setLoaded(true)
  // }, [])

  // Resolver el problema de hidratación solucion 2 con zustand
  useEffect(() => {
    // Rehidratar el estado del carrito una vez que el componente se haya montado en el (store) skipHydration: true,
    useCartStore.persist.rehydrate()
  }, [])

  return (
    <>
      {/* Espacio para compensar el nav fijo */}
      <div className='h-[60px]' />
      <nav className='fixed top-0 left-0 w-full bg-white z-10  py-2 px-3 flex justify-between items-center'>
        {/* Logo */}
        <div>
          <Link href='/' className=''>
            <span className={`${titleFont.className} antialiased font-bold`}>
              Teslo
            </span>
            <span> | Shop</span>
          </Link>
        </div>

        {/* Center Menu */}
        <div className='hidden sm:block'>
          <Link
            className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
            href={'/gender/men'}
          >
            Hombres
          </Link>
          <Link
            className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
            href={'/gender/women'}
          >
            Mujeres
          </Link>
          <Link
            className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
            href={'/gender/kid'}
          >
            Niños
          </Link>
        </div>

        {/* Search, Cart, Menu */}
        <div className='flex items-center'>
          <Link href={'/search'} className='mx-2'>
            <IoSearchOutline className='w-5 h-5' />
          </Link>
          <Link
            href={totalItemsInCart === 0 ? '/empty' : '/cart'}
            className='mx-2'
          >
            <div className='relative'>
              {totalItemsInCart > 0 && (
                <span className='absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white fade-in'>
                  {totalItemsInCart}
                </span>
              )}
              <IoCartOutline className='w-5 h-5' />
            </div>
          </Link>

          <button
            onClick={openSideMenu}
            type='button'
            className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
          >
            Menu
          </button>
        </div>
      </nav>
    </>
  )
}
