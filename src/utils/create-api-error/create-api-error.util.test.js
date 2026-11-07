import { describe, expect, test } from 'vitest'
import { ApiError } from '@/errors/api'
import { createApiError } from './create-api-error.util.js'

const createResponse = (status, body) => ({
  status,
  json: async () => {
    if (body instanceof Error) throw body

    return body
  },
})

describe('Create Api Error', () => {
  test('reads the code, message and fields of the backend error', async () => {
    const response = createResponse(400, {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        fields: { text: 'Text is too short' },
      },
    })

    const error = await createApiError(response)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(400)
    expect(error.code).toBe('VALIDATION_ERROR')
    expect(error.message).toBe('Invalid request data')
    expect(error.fields).toEqual({ text: 'Text is too short' })
  })

  test('uses the default message when the backend error has none', async () => {
    const error = await createApiError(createResponse(500, { error: { code: 'X' } }))

    expect(error.message).toBe('Some error occurred')
    expect(error.code).toBe('X')
  })

  test('uses the default message when the body is not JSON', async () => {
    const error = await createApiError(createResponse(502, new Error('not json')))

    expect(error.message).toBe('Some error occurred')
    expect(error.status).toBe(502)
  })

  test('does not read a body that has no error object', async () => {
    const error = await createApiError(
      createResponse(500, { message: 'Old format' }),
    )

    expect(error.message).toBe('Some error occurred')
    expect(error.status).toBe(500)
    expect(error.code).toBeUndefined()
  })

  test('does not read the old list of field errors', async () => {
    const error = await createApiError(
      createResponse(400, {
        errors: [{ type: 'field', path: 'text', msg: 'Too short' }],
      }),
    )

    expect(error.message).toBe('Some error occurred')
    expect(error.fields).toBeUndefined()
  })
})
