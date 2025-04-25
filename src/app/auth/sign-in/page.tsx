import { titleFont } from '@/config/fonts'
import Link from 'next/link'
import { LoginForm } from './ui/LoginForm'

export default function SignInPage() {
  return (
    <div className='flex flex-col min-h-screen pt-32 sm:pt-52'>
      <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>

      <div className='flex flex-col'>
        <LoginForm />

        <div className='flex items-center justify-center my-5'>
          <div className='border-t border-gray-300 w-full' />
          <span className='mx-2 text-gray-500'>O</span>
          <div className='border-t border-gray-300 w-full' />
        </div>

        <div className='flex items-center justify-center'>
          <span className='text-gray-500'>¿No tienes cuenta?</span>
          <Link
            href='/auth/sign-up'
            className='text-blue-500 hover:underline ml-2'
          >
            Registrate
          </Link>
        </div>
      </div>
    </div>
  )
}
