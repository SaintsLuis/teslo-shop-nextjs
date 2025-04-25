'use client'

import Link from 'next/link'
import { IoHomeOutline } from 'react-icons/io5'
import { IoMdArrowDropleft } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import { titleFont } from '@/config/fonts'
import Image from 'next/image'

export const PageNotFound = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className='flex flex-col md:flex-row items-center justify-center min-h-[80vh] px-6 py-12 gap-8'>
      <div className='flex flex-col items-center text-center max-w-xl order-2 md:order-1'>
        <h1
          className={`${titleFont.className} text-9xl font-bold text-gray-400`}
        >
          404
        </h1>

        <div className='my-6'>
          <h2 className='text-3xl font-bold text-gray-800 mb-3'>
            Página no encontrada
          </h2>
          <p className='text-gray-600 mb-8'>
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/'
              className='flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              <IoHomeOutline className='h-5 w-5' />
              Ir al inicio
            </Link>

            <button
              onClick={handleGoBack}
              className='flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
            >
              <IoMdArrowDropleft className='h-5 w-5' />
              Volver atrás
            </button>
          </div>
        </div>
      </div>

      <div className='order-1 md:order-2 w-full max-w-md'>
        <Image
          src={'/imgs/starman_750x750.png'}
          alt='Starman'
          className='animate-float'
          width={500}
          height={500}
          priority
        />
      </div>
    </div>
  )
}
