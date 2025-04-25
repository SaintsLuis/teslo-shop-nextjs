'use server'

import type { Address } from '@/interfaces'
import prisma from '@/lib/prisma'

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId)

    // console.log('Address saved:', newAddress)

    return {
      ok: true,
      address: newAddress,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al guardar la dirección',
    }
  }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    })

    const addressToSave = {
      address: address.address,
      address2: address.address2,
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      postalCode: address.postalCode,
      city: address.city,
      phone: address.phone,
    }

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: {
          ...addressToSave,
          userId,
        },
      })

      return newAddress
    }

    const updatedAddress = await prisma.userAddress.update({
      where: {
        userId,
      },
      data: addressToSave,
    })

    return updatedAddress
  } catch (error) {
    console.log(error)
    throw new Error('Error al crear o reemplazar la dirección')
  }
}
