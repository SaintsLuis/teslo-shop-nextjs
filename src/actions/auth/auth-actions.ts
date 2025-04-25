'use server'

import { auth } from '@/lib/auth'

import { isBetterAuthError, getFriendlyErrorMessage } from '@/utils'
import { headers } from 'next/headers'

export async function getSessionAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    return { session }
  } catch (error) {
    // Manejo de errores
    if (isBetterAuthError(error)) {
      return {
        success: false,
        error: getFriendlyErrorMessage(error),
      }
    }

    // Error genérico (no es un BetterAuthError)
    console.error('Error inesperado al obtener la sesión:', error)
    return { success: false, error: 'Error al obtener la sesión' }
  }
}

export async function signInAction(data: { email: string; password: string }) {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    })

    // Devuelve el resultado directamente
    if (result.token) {
      return { success: true }
    }

    return { success: false, error: 'Credenciales inválidas' }
  } catch (error) {
    // Manejo de errores
    if (isBetterAuthError(error)) {
      return {
        success: false,
        error: getFriendlyErrorMessage(error),
      }
    }

    // Error genérico (no es un BetterAuthError)
    console.error('Error inesperado en inicio de sesión:', error)
    return { success: false, error: 'Error al iniciar sesión' }
  }
}

export async function signUpAction(data: {
  name: string
  email: string
  password: string
}) {
  try {
    // 1. Crear usuario y loguear
    const result = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    })

    if (result.token) {
      return { success: true }
    }
    return { success: false, error: 'Error al crear la cuenta' }
  } catch (error) {
    if (isBetterAuthError(error)) {
      return {
        success: false,
        error: getFriendlyErrorMessage(error),
      }
    }
    console.error('Error inesperado en registro:', error)
    return { success: false, error: 'Error al crear la cuenta' }
  }
}

export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    })

    return { success: true }
  } catch (error) {
    // Manejo de errores
    if (isBetterAuthError(error)) {
      return {
        success: false,
        error: getFriendlyErrorMessage(error),
      }
    }

    // Error genérico (no es un BetterAuthError)
    console.error('Error inesperado al cerrar sesión:', error)
    return { success: false, error: 'Error al cerrar sesión' }
  }
}
