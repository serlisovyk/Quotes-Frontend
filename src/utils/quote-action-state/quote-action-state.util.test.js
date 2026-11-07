import { describe, expect, test } from 'vitest'
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

  test('creates a delete error state', () => {
    expect(createDeleteApiErrorState({ message: 'Delete failed' })).toEqual({
      error: 'Delete failed',
    })
  })
})
