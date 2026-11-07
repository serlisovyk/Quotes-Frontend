import { describe, expect, test, vi } from 'vitest'
import { MAX_SEARCH_LIMIT } from '@/constants'
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
    limit: '10',
    offset: '5',
  }

  test('describes the five search fields with their values', () => {
    const fields = createSearchInputFields({ searchValues, validationErrors: {} })

    expect(fields.map(({ id, value }) => [id, value])).toEqual([
      ['text', 'sharp'],
      ['author', 'Someone'],
      ['category', 'life'],
      ['limit', '10'],
      ['offset', '5'],
    ])
  })

  test('gives the number fields their bounds', () => {
    const fields = createSearchInputFields({ searchValues, validationErrors: {} })
    const limit = fields.find(({ id }) => id === 'limit')
    const offset = fields.find(({ id }) => id === 'offset')

    expect(limit).toMatchObject({ type: 'number', min: 1, max: MAX_SEARCH_LIMIT })
    expect(offset).toMatchObject({ type: 'number', min: 0 })
  })

  test('shows an empty value for an empty limit and offset', () => {
    const fields = createSearchInputFields({
      searchValues: { ...searchValues, limit: '', offset: undefined },
      validationErrors: {},
    })

    expect(fields.find(({ id }) => id === 'limit').value).toBe('')
    expect(fields.find(({ id }) => id === 'offset').value).toBe('')
  })

  test('passes the validation errors to their fields', () => {
    const fields = createSearchInputFields({
      searchValues,
      validationErrors: { limit: 'Limit is too big' },
    })

    expect(fields.find(({ id }) => id === 'limit').error).toBe('Limit is too big')
  })
})
