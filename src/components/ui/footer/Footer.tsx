import { titleFont } from '@/config/fonts'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className='flex flex-col items-center w-full border-t py-5 mt-10'>
      <div className='flex w-full justify-center text-xs mb-2'>
        <Link href={'/'} className='flex items-center gap-1 hover:underline'>
          <span className={`${titleFont.className} antialiased font-bold`}>
            Teslo
          </span>
          <span>| shop</span>
        </Link>
      </div>

      <div className='flex items-center justify-center text-xs text-gray-500'>
        <span>
          &copy; {new Date().getFullYear()} Teslo Shop. Todos los derechos
          reservados.
        </span>
      </div>

      <div className='flex gap-4 mt-2 text-xs text-gray-500'>
        <Link href='/terms' className='hover:underline'>
          Términos de uso
        </Link>
        <Link href='/privacy' className='hover:underline'>
          Política de privacidad
        </Link>
      </div>
    </footer>
  )
}
