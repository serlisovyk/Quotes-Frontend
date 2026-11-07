import { describe, expect, test } from 'vitest'
import {
  createInitialQuoteFormState,
  createQuoteFormValues,
} from './quote-form.util.js'

describe('createInitialQuoteFormState utility function', () => {
  test('creates clean form state from provided values', () => {
    const values = {
      text: 'This is a valid quote text.',
      author: 'Author',
      categories: 'category',
    }

    expect(createInitialQuoteFormState(values)).toEqual({
      values,
      errors: {},
      formError: '',
    })
  })
})

describe('createQuoteFormValues utility function', () => {
  test('creates form-ready values from quote entity', () => {
    const quote = {
      text: 'This is a valid quote text.',
      author: 'Author',
      categories: ['category-1', 'category-2'],
    }

    expect(createQuoteFormValues(quote)).toEqual({
      text: 'This is a valid quote text.',
      author: 'Author',
      categories: 'category-1, category-2',
    })
  })
})
