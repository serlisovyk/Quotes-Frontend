import { describe, expect, test } from 'vitest'
import { DEFAULT_ERROR_MESSAGE, TOO_MANY_REQUESTS_MESSAGE } from '@/constants'
import { getApiErrorMessages } from './get-api-error-messages.util.js'

describe('Get Api Error Messages', () => {
  test('lists one message per failed field with the field name', () => {
    const error = {
      message: 'Validation failed',
      fields: { text: 'Text is too short', author: 'Author is required' },
    }

    expect(getApiErrorMessages(error)).toEqual([
      'Text is too short (text)',
      'Author is required (author)',
    ])
  })

  test('asks to try again later when the rate limit is hit', () => {
    const error = { message: 'Rate limit exceeded', status: 429 }

    expect(getApiErrorMessages(error)).toEqual([TOO_MANY_REQUESTS_MESSAGE])
  })

  test('prefers the rate limit message over field errors', () => {
    const error = { message: 'Slow down', status: 429, fields: { text: 'Bad' } }

    expect(getApiErrorMessages(error)).toEqual([TOO_MANY_REQUESTS_MESSAGE])
  })

  test('keeps the error message for other statuses', () => {
    expect(getApiErrorMessages({ message: 'Teapot', status: 418 })).toEqual([
      'Teapot',
    ])
  })

  test('uses the error message when there are no fields', () => {
    expect(getApiErrorMessages({ message: 'Server exploded' })).toEqual([
      'Server exploded',
    ])
  })

  test('uses the error message when the fields are empty', () => {
    expect(getApiErrorMessages({ message: 'Bad', fields: {} })).toEqual(['Bad'])
  })

  test('uses the default message when the error has no message', () => {
    expect(getApiErrorMessages(new Error(''))).toEqual([DEFAULT_ERROR_MESSAGE])
  })

  test.each([undefined, null])('uses the default message for %s', (missingError) => {
    expect(getApiErrorMessages(missingError)).toEqual([DEFAULT_ERROR_MESSAGE])
  })
})
