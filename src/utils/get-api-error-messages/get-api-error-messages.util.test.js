import { describe, expect, test } from 'vitest'
import { DEFAULT_ERROR_MESSAGE } from '@/constants'
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
