'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Country, Address } from '@/interfaces'
import { useAddressStore } from '@/store'
import { useEffect } from 'react'
import { setUserAddress } from '@/actions/address/set-user-address'
import { deleteUserAddress } from '@/actions/address/delete-user-address'

type AddressFormData = {
  firstName: string
  lastName: string
  address: string
  address2?: string
  postalCode: string
  city: string
  country: string
  phone: string
  rememberAddress: boolean
}

interface Props {
  userId: string
  countries: Country[]
  userStoredAddress?: Partial<Address>
}

export const AddressForm = ({
  userId,
  countries,
  userStoredAddress = {},
}: Props) => {
  const router = useRouter()

  // store de Zustand
  const address = useAddressStore((state) => state.address)
  const setAddress = useAddressStore((state) => state.setAddress)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<AddressFormData>({
    defaultValues: {
      ...userStoredAddress,
      rememberAddress: false,
    },
  })

  // Esperar a que Zustand hidrate el store
  useEffect(() => {
    useAddressStore.persist.rehydrate()
  }, [])

  // Cuando el store esté hidratado, resetea el formulario con los datos del store
  useEffect(() => {
    if (address.firstName) {
      reset(address)
    }
  }, [address, reset])

  const onSubmit = async (data: AddressFormData) => {
    const { rememberAddress, ...restAddress } = data

    setAddress(restAddress)

    if (rememberAddress) {
      await setUserAddress(restAddress, userId)
    } else {
      await deleteUserAddress(userId)
    }

    router.push('/checkout')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2'>
        <div className='flex flex-col mb-2'>
          <span>Nombres</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('firstName', { required: 'El nombre es obligatorio' })}
          />
          {errors.firstName && (
            <span className='text-red-500 text-xs'>
              {errors.firstName.message}
            </span>
          )}
        </div>

        <div className='flex flex-col mb-2'>
          <span>Apellidos</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('lastName', {
              required: 'El apellido es obligatorio',
            })}
          />
          {errors.lastName && (
            <span className='text-red-500 text-xs'>
              {errors.lastName.message}
            </span>
          )}
        </div>

        <div className='flex flex-col mb-2'>
          <span>Dirección</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('address', {
              required: 'La dirección es obligatoria',
            })}
          />
          {errors.address && (
            <span className='text-red-500 text-xs'>
              {errors.address.message}
            </span>
          )}
        </div>

        <div className='flex flex-col mb-2'>
          <span>Dirección 2 (opcional)</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('address2')}
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Código postal</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('postalCode', {
              required: 'El código postal es obligatorio',
            })}
          />
          {errors.postalCode && (
            <span className='text-red-500 text-xs'>
              {errors.postalCode.message}
            </span>
          )}
        </div>

        <div className='flex flex-col mb-2'>
          <span>Ciudad</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('city', { required: 'La ciudad es obligatoria' })}
          />
          {errors.city && (
            <span className='text-red-500 text-xs'>{errors.city.message}</span>
          )}
        </div>

        <div className='flex flex-col mb-2'>
          <span>País</span>
          <select
            className='p-2 border rounded-md bg-gray-200'
            {...register('country', { required: 'El país es obligatorio' })}
          >
            <option value=''>[ Seleccione ]</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <span className='text-red-500 text-xs'>
              {errors.country.message}
            </span>
          )}
        </div>

        <div className='flex flex-col mb-2'>
          <span>Teléfono</span>
          <input
            type='text'
            className='p-2 border rounded-md bg-gray-200'
            {...register('phone', { required: 'El teléfono es obligatorio' })}
          />
          {errors.phone && (
            <span className='text-red-500 text-xs'>{errors.phone.message}</span>
          )}
        </div>

        <div className='flex flex-col mb-2 sm:mt-1'>
          <div className='inline-flex items-center mb-10'>
            <label
              className='relative flex cursor-pointer items-center rounded-full p-3'
              htmlFor='checkbox'
            >
              <input
                type='checkbox'
                className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                id='checkbox'
                {...register('rememberAddress')}
              />
              <div className='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-3.5 w-3.5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  stroke='currentColor'
                  strokeWidth='1'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </div>
            </label>

            <span className='ml-2 text-sm text-gray-700'>
              ¿Recordar dirección?
            </span>
          </div>
          <button
            type='submit'
            // className='btn-primary flex w-full sm:w-1/2 justify-center'
            className={clsx(
              'flex w-full sm:w-1/2 justify-center',
              isValid ? 'btn-primary ' : 'btn-disabled '
            )}
            disabled={!isValid}
          >
            {isSubmitting ? 'Guardando...' : 'Siguiente'}
          </button>
        </div>
      </div>
    </form>
  )
}
