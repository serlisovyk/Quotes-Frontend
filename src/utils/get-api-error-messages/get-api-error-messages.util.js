import { DEFAULT_ERROR_MESSAGE } from '@/constants'

function getFieldMessages(fields) {
  if (!fields) return []

  return Object.entries(fields).map(([field, message]) => `${message} (${field})`)
}

export function getApiErrorMessages(error) {
  if (error?.fields) {
    const fieldMessages = getFieldMessages(error.fields)

    if (fieldMessages.length) return fieldMessages
  }

  return [error?.message || DEFAULT_ERROR_MESSAGE]
}
