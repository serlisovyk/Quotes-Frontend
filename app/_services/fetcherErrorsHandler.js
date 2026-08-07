export class ApiError extends Error {
  constructor({ message, status, code, fields }) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

function getFieldMessages(fields) {
  if (!fields) return []

  return Object.entries(fields).map(([field, message]) => `${message} (${field})`)
}

export function getApiErrorMessages(error) {
  if (error?.fields) {
    const fieldMessages = getFieldMessages(error.fields)

    if (fieldMessages.length) return fieldMessages
  }

  return [error?.message || 'Some error occurred']
}

async function parseErrorBody(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function createErrorFromLegacyBody(response, errorBody) {
  if (errorBody?.message) {
    return new ApiError({
      message: errorBody.message,
      status: response.status,
    })
  }

  if (Array.isArray(errorBody?.errors)) {
    const fields = errorBody.errors
      .filter((error) => error.type === 'field')
      .reduce((acc, error) => {
        acc[error.path] = error.msg
        return acc
      }, {})

    return new ApiError({
      message: 'Invalid request data',
      status: response.status,
      code: 'VALIDATION_ERROR',
      fields,
    })
  }
}

export async function createApiError(response) {
  const errorBody = await parseErrorBody(response)
  const apiError = errorBody?.error

  if (apiError) {
    return new ApiError({
      message: apiError.message || 'Some error occurred',
      status: response.status,
      code: apiError.code,
      fields: apiError.fields,
    })
  }

  return (
    createErrorFromLegacyBody(response, errorBody) ||
    new ApiError({
      message: 'Some error occurred',
      status: response.status,
    })
  )
}
