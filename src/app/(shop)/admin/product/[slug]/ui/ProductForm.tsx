'use client'

import { Product, Category, ProductImage } from '@/interfaces'
import { useForm } from 'react-hook-form'

import { createUpdateProduct } from '@/actions/products/create-update-product'
import { ProductImage as Image } from '@/components'
import { useRouter } from 'next/navigation'
import { deleteProductImage } from '@/actions/products/delete-product-image'

interface Props {
  product: Partial<Product> & { ProductImage?: ProductImage[] }
  categories: Category[]
}

interface FormInputs {
  title: string
  slug: string
  description: string
  price: number
  inStock: number
  sizes: string[]
  tags: string
  gender: 'men' | 'women' | 'kid' | 'unisex'
  categoryId: string
  images?: FileList // si manejas archivos o imagenes
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],
      images: undefined, // para archivos, manejar aparte
    },
  })

  const onSubmit = async (data: FormInputs) => {
    // Aquí envías los datos al backend

    const formData = new FormData()

    const { images, ...productToSave } = data

    if (product.id) {
      formData.append('id', product.id ?? '')
    }
    formData.append('title', productToSave.title)
    formData.append('slug', productToSave.slug)
    formData.append('description', productToSave.description)
    formData.append('price', productToSave.price.toString())
    formData.append('inStock', productToSave.inStock.toString())
    formData.append('sizes', productToSave.sizes.join(','))
    formData.append('tags', productToSave.tags)
    formData.append('categoryId', productToSave.categoryId)
    formData.append('gender', productToSave.gender)

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i])
      }
    }

    // server action
    const response = await createUpdateProduct(formData)

    if (!response.ok) {
      alert('Producto no se pudo guardar')
      return
    }

    router.replace(`/admin/product/${response.product?.slug}`)
  }

  // Para manejar tallas como checkboxes
  const selectedSizes = watch('sizes') || []

  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s: string) => s !== size)
      : [...selectedSizes, size]
    setValue('sizes', newSizes)
  }

  return (
    <form
      className='grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3'
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Textos */}
      <div className='w-full'>
        <div className='flex flex-col mb-2'>
          <span>Título</span>
          <input
            {...register('title', { required: true })}
            type='text'
            className='p-2 border rounded-md bg-gray-200'
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Slug</span>
          <input
            {...register('slug', { required: true })}
            type='text'
            className='p-2 border rounded-md bg-gray-200'
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Descripción</span>
          <textarea
            {...register('description', { required: true })}
            rows={5}
            className='p-2 border rounded-md bg-gray-200'
          ></textarea>
        </div>

        <div className='flex flex-col mb-2'>
          <span>Price</span>
          <input
            {...register('price', {
              required: true,
              valueAsNumber: true,
              min: 0,
            })}
            type='number'
            className='p-2 border rounded-md bg-gray-200'
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Tags</span>
          <input
            {...register('tags', {
              required: true,
              // validate: (value) => value.split(',').length <= 5,
            })}
            type='text'
            className='p-2 border rounded-md bg-gray-200'
          />
        </div>

        <div className='flex flex-col mb-2'>
          <span>Gender</span>
          <select
            {...register('gender', { required: true })}
            className='p-2 border rounded-md bg-gray-200'
          >
            <option value=''>[Seleccione]</option>
            <option value='men'>Men</option>
            <option value='women'>Women</option>
            <option value='kid'>Kid</option>
            <option value='unisex'>Unisex</option>
          </select>
        </div>

        <div className='flex flex-col mb-2'>
          <span>Categoria</span>
          <select
            {...register('categoryId', { required: true })}
            className='p-2 border rounded-md bg-gray-200'
          >
            <option value=''>[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className='btn-primary w-full'
          type='submit'
          disabled={!isValid}
        >
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className='w-full'>
        <div className='flex flex-col mb-2'>
          <span>Stock</span>
          <input
            {...register('inStock', {
              required: true,
              valueAsNumber: true,
              min: 0,
            })}
            type='number'
            className='p-2 border rounded-md bg-gray-200'
          />
        </div>

        <div className='flex flex-col'>
          <span>Tallas</span>
          <div className='flex flex-wrap'>
            {sizes.map((size) => (
              <div
                key={size}
                className={`flex items-center justify-center w-10 h-10 mr-2 border rounded-md cursor-pointer ${
                  selectedSizes.includes(size) ? 'bg-blue-500 text-white' : ''
                }`}
                onClick={() => toggleSize(size)}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>
          {/* Campo oculto para react-hook-form */}
          <input
            type='hidden'
            {...register('sizes')}
            value={selectedSizes.join(',')}
          />

          <div className='flex flex-col mb-2 mt-4'>
            <span>Fotos</span>
            <input
              type='file'
              multiple
              className='p-2 border rounded-md bg-gray-200'
              accept='image/png, image/jpeg, image/avif'
              {...register('images')} // Si quieres manejar archivos con react-hook-form
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <Image
                  src={image.url}
                  alt={product.title ?? ''}
                  width={300}
                  height={300}
                  className='rounded-t-xl shadow-md'
                />

                <button
                  className='btn-danger w-full rounded-b-xl'
                  type='button'
                  onClick={() => deleteProductImage(image.id, image.url)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  )
}
