'use client'

import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { signUpAction } from '@/actions/auth/auth-actions'

type FormData = {
  name: string
  email: string
  password: string
}

export const RegisterForm = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setErrorMessage('')

    // llamar el server action
    const result = await signUpAction(data)

    if (result.success) {
      // Redirige al usuario al inicio
      router.replace('/')
    } else {
      setErrorMessage(result.error || 'Error al crear la cuenta')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
      {errorMessage && (
        <div className='bg-red-500 text-white p-2 mb-2 rounded'>
          {errorMessage}
        </div>
      )}

      <label htmlFor='name'>Nombre completo</label>
      <input
        className='px-5 py-2 border bg-gray-200 rounded mb-2'
        type='text'
        autoFocus
        {...register('name', { required: 'El nombre es obligatorio' })}
      />
      {errors.name && (
        <span className='text-red-500 text-sm mb-3'>{errors.name.message}</span>
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
        {...register('password', {
          required: 'La contraseña es obligatoria',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        })}
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
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  )
}
