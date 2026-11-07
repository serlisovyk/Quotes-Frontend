import { describe, expect, test, vi } from 'vitest'
import { DEFAULT_SEARCH_LIMIT, SEARCH_LIMIT_OPTIONS } from '@/constants'
import {
  createQuoteInputFields,
  createSearchInputFields,
} from './input-fields.config.js'

const values = { text: 'A quote', author: 'Someone', categories: 'life' }

describe('Quote Input Fields', () => {
  test('describes the text, author and categories fields with their values', () => {
    const fields = createQuoteInputFields({
      values,
      setValues: vi.fn(),
      validationErrors: { author: 'Author is required' },
    })

    expect(fields.map(({ id, value }) => [id, value])).toEqual([
      ['text', 'A quote'],
      ['author', 'Someone'],
      ['categories', 'life'],
    ])
    expect(fields.map(({ error }) => error)).toEqual([
      undefined,
      'Author is required',
      undefined,
    ])
  })

  test.each([
    ['text', 'New text'],
    ['author', 'New author'],
    ['categories', 'new, tags'],
  ])('updates only the %s value through setValues', (id, newValue) => {
    const setValues = vi.fn()
    const fields = createQuoteInputFields({
      values,
      setValues,
      validationErrors: {},
    })

    fields.find((field) => field.id === id).onChange({ target: { value: newValue } })

    expect(setValues).toHaveBeenCalledWith({ ...values, [id]: newValue })
  })

  test('makes the categories field a multiple category combobox and the others plain inputs', () => {
    const fields = createQuoteInputFields({ values, validationErrors: {} })

    expect(fields.map(({ id, control }) => [id, control])).toEqual([
      ['text', undefined],
      ['author', undefined],
      ['categories', 'category'],
    ])
    expect(fields.find(({ id }) => id === 'categories').isMultiple).toBe(true)
  })

  test('leaves the fields without change handlers when there is no setValues', () => {
    const fields = createQuoteInputFields({ values, validationErrors: {} })

    expect(fields.every(({ onChange }) => onChange === undefined)).toBe(true)
  })
})

describe('Search Input Fields', () => {
  const searchValues = {
    text: 'sharp',
    author: 'Someone',
    category: 'life',
    limit: '20',
    offset: '5',
  }

  test('describes the four search fields with their values and no offset', () => {
    const fields = createSearchInputFields({ searchValues, validationErrors: {} })

    expect(fields.map(({ id, value }) => [id, value])).toEqual([
      ['text', 'sharp'],
      ['author', 'Someone'],
      ['category', 'life'],
      ['limit', '20'],
    ])
  })

  test('makes the category a single category combobox', () => {
    const fields = createSearchInputFields({ searchValues, validationErrors: {} })
    const category = fields.find(({ id }) => id === 'category')

    expect(category.control).toBe('category')
    expect(category.isMultiple).toBeUndefined()
  })

  test('makes the limit a select of the allowed limits', () => {
    const fields = createSearchInputFields({ searchValues, validationErrors: {} })
    const limit = fields.find(({ id }) => id === 'limit')

    expect(limit).toMatchObject({ control: 'select', options: SEARCH_LIMIT_OPTIONS })
  })

  test('shows the default limit for an empty one', () => {
    const fields = createSearchInputFields({
      searchValues: { ...searchValues, limit: '' },
      validationErrors: {},
    })

    expect(fields.find(({ id }) => id === 'limit').value).toBe(
      String(DEFAULT_SEARCH_LIMIT),
    )
  })

  test('passes the validation errors to their fields', () => {
    const fields = createSearchInputFields({
      searchValues,
      validationErrors: { limit: 'Limit is too big' },
    })

    expect(fields.find(({ id }) => id === 'limit').error).toBe('Limit is too big')
  })
})
