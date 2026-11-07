import { describe, expect, test } from 'vitest'
import {
  createQuotePayload,
  getQuoteFormValidationErrors,
  getSearchInputValidationMessage,
  getSearchValidationErrors,
  isQuoteValidId,
} from './validation.util.js'

const createValues = (overrides = {}) => ({
  text: 'This is a valid quote text.',
  author: 'Author Name',
  categories: 'category1, category2',
  ...overrides,
})

describe('getQuoteFormValidationErrors utility function', () => {
  test('returns empty errors for valid quote values', () => {
    const result = getQuoteFormValidationErrors({
      text: 'This is a valid quote text.',
      author: 'Author Name',
      categories: 'category1, category2',
    })

    expect(result).toEqual({})
  })

  test('returns validation errors without requiring React setters', () => {
    const result = getQuoteFormValidationErrors({
      text: 'Short',
      author: 'A',
      categories: '',
    })

    expect(result).toEqual({
      text: 'Text must be from 10 to 2500 characters.',
      author: 'Author must be from 2 to 255 characters.',
      categories: 'There must be from 1 to 10 categories.',
    })
  })

  test.each([
    ['10 characters', 'a'.repeat(10), undefined],
    ['9 characters', 'a'.repeat(9), 'Text must be from 10 to 2500 characters.'],
    ['2500 characters', 'a'.repeat(2500), undefined],
    [
      '2501 characters',
      'a'.repeat(2501),
      'Text must be from 10 to 2500 characters.',
    ],
  ])('checks the text limits: %s', (_label, text, message) => {
    expect(getQuoteFormValidationErrors(createValues({ text })).text).toBe(message)
  })

  test.each([
    ['2 characters', 'ab', undefined],
    ['1 character', 'a', 'Author must be from 2 to 255 characters.'],
    ['255 characters', 'a'.repeat(255), undefined],
    ['256 characters', 'a'.repeat(256), 'Author must be from 2 to 255 characters.'],
  ])('checks the author limits: %s', (_label, author, message) => {
    expect(getQuoteFormValidationErrors(createValues({ author })).author).toBe(
      message,
    )
  })

  test.each([
    ['10 categories', 10, undefined],
    ['11 categories', 11, 'There must be from 1 to 10 categories.'],
  ])('checks the number of categories: %s', (_label, count, message) => {
    const categories = Array.from({ length: count }, (_, i) => `tag-${i}`).join(',')

    expect(
      getQuoteFormValidationErrors(createValues({ categories })).categories,
    ).toBe(message)
  })

  test.each([
    ['50 characters', 'a'.repeat(50), undefined],
    [
      '51 characters',
      'a'.repeat(51),
      'Category name must be at most 50 characters.',
    ],
  ])('checks the length of a category name: %s', (_label, name, message) => {
    const result = getQuoteFormValidationErrors(createValues({ categories: name }))

    expect(result.categories).toBe(message)
  })

  test('lists the categories with forbidden characters', () => {
    const result = getQuoteFormValidationErrors(
      createValues({ categories: 'good, Bad, no_pe, fine-1' }),
    )

    expect(result.categories).toBe(
      'Invalid categories: Bad, no_pe. Category can only contain lowercase letters, numbers and dashes.',
    )
  })
})

describe('getSearchValidationErrors utility function', () => {
  test('returns no errors for valid and empty values', () => {
    const result = getSearchValidationErrors({
      text: 'ab',
      author: '',
      category: 'valid-category',
      limit: '10',
      offset: '0',
    })

    expect(result).toEqual({})
  })

  test('returns the message of every invalid field by its name', () => {
    const result = getSearchValidationErrors({
      text: 'life',
      category: 'Bad Category',
      limit: '100',
      offset: '-1',
    })

    expect(result).toEqual({
      category: 'Category can only contain lowercase letters, numbers and dashes.',
      limit: 'Limit must be in range 1..50.',
      offset: 'Offset must be a positive integer or zero.',
    })
  })
})

describe('isQuoteValidId utility function', () => {
  test.each(['1', '12', '2147483647', 12])('accepts %s', (id) => {
    expect(isQuoteValidId(id)).toBe(true)
  })

  test.each([
    '12abc',
    'abc',
    '1.5',
    '-1',
    '+1',
    ' 12',
    '12 ',
    '0',
    '',
    '2147483648',
    undefined,
    null,
  ])('rejects %s', (id) => {
    expect(isQuoteValidId(id)).toBe(false)
  })
})

describe('createQuotePayload utility function', () => {
  test('normalizes category input into trimmed category names', () => {
    const result = createQuotePayload({
      text: 'This is a valid quote text.',
      author: 'Author Name',
      categories: 'category1, category2, category3',
    })

    expect(result).toEqual({
      text: 'This is a valid quote text.',
      author: 'Author Name',
      categories: ['category1', 'category2', 'category3'],
    })
  })
})

describe('getSearchInputValidationMessage utility function', () => {
  test('does not block short text searches because backend accepts them', () => {
    const result = getSearchInputValidationMessage('text', 'ab')
    expect(result).toBeUndefined()
  })

  test('does not block short author searches because backend accepts them', () => {
    const result = getSearchInputValidationMessage('author', 'A')
    expect(result).toBeUndefined()
  })

  test('returns error message for invalid category', () => {
    const result = getSearchInputValidationMessage('category', 'invalid-category@')
    expect(result).toBe(
      'Category can only contain lowercase letters, numbers and dashes.',
    )
  })

  test('returns no message for valid category', () => {
    const result = getSearchInputValidationMessage('category', 'valid-category')
    expect(result).toBeUndefined()
  })

  test('returns error message for invalid limit', () => {
    const result = getSearchInputValidationMessage('limit', '100')
    expect(result).toBe('Limit must be in range 1..50.')
  })

  test('returns no message for valid limit', () => {
    const result = getSearchInputValidationMessage('limit', '10')
    expect(result).toBeUndefined()
  })

  test('returns error message for invalid offset', () => {
    const result = getSearchInputValidationMessage('offset', '-1')
    expect(result).toBe('Offset must be a positive integer or zero.')
  })

  test('returns no message for valid offset', () => {
    const result = getSearchInputValidationMessage('offset', '0')
    expect(result).toBeUndefined()
  })
})
