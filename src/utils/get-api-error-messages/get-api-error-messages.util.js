import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_TOO_MANY_REQUESTS,
  TOO_MANY_REQUESTS_MESSAGE,
} from '@/constants'

function getFieldMessages(fields) {
  return Object.entries(fields).map(([field, message]) => `${message} (${field})`)
}

export function getApiErrorMessages(error) {
  const isRateLimited = error?.status === HTTP_STATUS_TOO_MANY_REQUESTS

  if (isRateLimited) return [TOO_MANY_REQUESTS_MESSAGE]

  if (error?.fields) {
    const fieldMessages = getFieldMessages(error.fields)

    if (fieldMessages.length) return fieldMessages
  }

  return [error?.message || DEFAULT_ERROR_MESSAGE]
}
