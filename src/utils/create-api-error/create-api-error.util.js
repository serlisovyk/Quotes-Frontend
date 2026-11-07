import { ApiError } from '@/errors/api'
import { DEFAULT_ERROR_MESSAGE } from '@/constants'

async function parseErrorBody(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function createApiError(response) {
  const errorBody = await parseErrorBody(response)
  const { message, code, fields } = errorBody?.error ?? {}

  return new ApiError({
    message: message || DEFAULT_ERROR_MESSAGE,
    status: response.status,
    code,
    fields,
  })
}
