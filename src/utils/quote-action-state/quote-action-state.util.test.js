import { describe, expect, test } from 'vitest'
import {
  SERVER_NOT_RESPONDING_MESSAGE,
  TOO_MANY_REQUESTS_MESSAGE,
} from '@/constants'
import {
  createApiErrorState,
  createDeleteApiErrorState,
  createQuoteActionState,
  createQuoteFormValuesFromFormData,
} from './quote-action-state.util.js'

describe('quoteActionState utilities', () => {
  test('creates quote form values from FormData', () => {
    const formData = new FormData()
    formData.set('text', 'Quote text')
    formData.set('author', 'Author')
    formData.set('categories', 'life, focus')

    expect(createQuoteFormValuesFromFormData(formData)).toEqual({
      text: 'Quote text',
      author: 'Author',
      categories: 'life, focus',
    })
  })

  test('falls back to empty strings for missing FormData entries', () => {
    expect(createQuoteFormValuesFromFormData(new FormData())).toEqual({
      text: '',
      author: '',
      categories: '',
    })
  })

  test('creates a default quote action state', () => {
    const values = {
      text: 'Quote text',
      author: 'Author',
      categories: 'life, focus',
    }

    expect(createQuoteActionState(values)).toEqual({
      values,
      errors: {},
      formError: '',
    })
  })

  test('creates an api error state with field errors', () => {
    const values = {
      text: 'Quote text',
      author: 'Author',
      categories: 'life, focus',
    }

    const error = {
      message: 'Invalid request data',
      fields: {
        categories: 'Category is invalid',
      },
    }

    expect(createApiErrorState(error, values)).toEqual({
      values,
      errors: {
        categories: 'Category is invalid',
      },
      formError: 'Category is invalid (categories)',
    })
  })

  test('creates an api error state without field errors for a plain error', () => {
    const values = { text: 'Quote text', author: 'Author', categories: '' }

    expect(createApiErrorState(new Error('Server down'), values)).toEqual({
      values,
      errors: {},
      formError: 'Server down',
    })
  })

  test('tells a rate limited form to try again later', () => {
    const values = { text: 'Quote text', author: 'Author', categories: '' }
    const error = { message: 'Rate limit exceeded', status: 429 }

    expect(createApiErrorState(error, values)).toEqual({
      values,
      errors: {},
      formError: TOO_MANY_REQUESTS_MESSAGE,
    })
  })

  test('tells a form that the server is not responding after a timeout', () => {
    const values = { text: 'Quote text', author: 'Author', categories: '' }
    const error = new DOMException(
      'The operation was aborted due to timeout',
      'TimeoutError',
    )

    expect(createApiErrorState(error, values).formError).toBe(
      SERVER_NOT_RESPONDING_MESSAGE,
    )
  })

  test('tells a delete that the server is not responding after a network failure', () => {
    expect(createDeleteApiErrorState(new TypeError('fetch failed'))).toEqual({
      error: SERVER_NOT_RESPONDING_MESSAGE,
    })
  })

  test('tells a rate limited delete to try again later', () => {
    const error = { message: 'Rate limit exceeded', status: 429 }

    expect(createDeleteApiErrorState(error)).toEqual({
      error: TOO_MANY_REQUESTS_MESSAGE,
    })
  })

  test('creates a delete error state', () => {
    expect(createDeleteApiErrorState({ message: 'Delete failed' })).toEqual({
      error: 'Delete failed',
    })
  })
})
