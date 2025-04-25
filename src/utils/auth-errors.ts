/**
 * Interfaz para los errores de Better Auth basada en la estructura real
 */
export interface BetterAuthError {
  status: string
  body: {
    code: string
    message: string
  }
  headers: Record<string, string>
  statusCode: number
  name: string
}

/**
 * Verifica si un error es del tipo BetterAuthError
 */
export function isBetterAuthError(error: unknown): error is BetterAuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'APIError' &&
    'statusCode' in error
  )
}

/**
 * Códigos de error de Better Auth
 */
export const ERROR_CODES = {
  INVALID_EMAIL_OR_PASSWORD: 'INVALID_EMAIL_OR_PASSWORD',
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  // Puedes agregar más códigos según los encuentres
}

/**
 * Obtiene un mensaje de error amigable basado en el código de error
 */
export function getFriendlyErrorMessage(error: BetterAuthError): string {
  // Verificar que error.body y error.body.code existan
  if (!error.body || !error.body.code) {
    return error.body?.message || 'Ha ocurrido un error, intenta nuevamente'
  }

  switch (error.body.code) {
    case ERROR_CODES.INVALID_EMAIL_OR_PASSWORD:
      return 'Correo electrónico o contraseña incorrectos'

    case ERROR_CODES.EMAIL_ALREADY_IN_USE:
      return 'Este correo electrónico ya está registrado'

    case ERROR_CODES.USER_NOT_FOUND:
      return 'Usuario no encontrado'

    default:
      if (error.statusCode === 401) {
        return 'No autorizado. Verifica tus credenciales'
      }
      if (error.statusCode === 422) {
        return 'Datos de registro inválidos'
      }
      return error.body.message || 'Ha ocurrido un error, intenta nuevamente'
  }
}
