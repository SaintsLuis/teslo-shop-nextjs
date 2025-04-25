'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { signInAction } from '@/actions/auth/auth-actions'

type FormData = {
  email: string
  password: string
}

export const LoginForm = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setErrorMessage('')

    // llamar el server action
    const result = await signInAction(data)

    if (result.success) {
      // Redirige al usuario al inicio
      router.replace('/')
    } else {
      setErrorMessage(result.error || 'Error al iniciar sesión')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
      {errorMessage && (
        <div className='bg-red-500 text-white p-2 mb-2 rounded'>
          {errorMessage}
        </div>
      )}

      <label htmlFor='email'>Correo electrónico</label>
      <input
        className='px-5 py-2 border bg-gray-200 rounded mb-2'
        type='email'
        {...register('email', {
          required: 'El correo es obligatorio',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo no válido',
          },
        })}
      />
      {errors.email && (
        <span className='text-red-500 text-sm mb-3'>
          {errors.email.message}
        </span>
      )}

      <label htmlFor='password'>Contraseña</label>
      <input
        className='px-5 py-2 border bg-gray-200 rounded mb-2'
        type='password'
        {...register('password', { required: 'La contraseña es obligatoria' })}
      />
      {errors.password && (
        <span className='text-red-500 text-sm mb-3'>
          {errors.password.message}
        </span>
      )}

      <button
        type='submit'
        className='btn-primary mt-3 disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Iniciando Sesion...' : 'Iniciar Sesion'}
      </button>
    </form>
  )
}
