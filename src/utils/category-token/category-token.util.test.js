import { describe, expect, test } from 'vitest'
import {
  getCategorySuggestionQuery,
  getCategoryToken,
  replaceCategoryToken,
} from './category-token.util.js'

describe('getCategoryToken utility function', () => {
  test('returns the whole trimmed value for a single category', () => {
    expect(getCategoryToken('  lead ', false)).toBe('lead')
  })

  test('returns the text after the last comma, trimmed, for a list', () => {
    expect(getCategoryToken('life, love,  cou', true)).toBe('cou')
  })

  test('returns the whole value for a list without a comma', () => {
    expect(getCategoryToken('cou', true)).toBe('cou')
  })

  test('returns an empty token right after a comma', () => {
    expect(getCategoryToken('life,', true)).toBe('')
    expect(getCategoryToken('life, ', true)).toBe('')
    expect(getCategoryToken('', true)).toBe('')
  })
})

describe('replaceCategoryToken utility function', () => {
  test('replaces the whole value for a single category', () => {
    expect(replaceCategoryToken('lead', 'leadership', false)).toBe('leadership')
  })

  test('replaces only the text after the last comma and keeps the others untouched', () => {
    expect(replaceCategoryToken('life, love, cou', 'courage', true)).toBe(
      'life, love, courage',
    )
    expect(replaceCategoryToken('life,cou', 'courage', true)).toBe('life, courage')
  })

  test('replaces a list that has no comma yet', () => {
    expect(replaceCategoryToken('cou', 'courage', true)).toBe('courage')
  })

  test('adds the category after a trailing comma', () => {
    expect(replaceCategoryToken('life, ', 'courage', true)).toBe('life, courage')
  })
})

describe('getCategorySuggestionQuery utility function', () => {
  test('returns the token when it can be a category name', () => {
    expect(getCategorySuggestionQuery('life, Cou', true)).toBe('Cou')
    expect(getCategorySuggestionQuery('bob-', false)).toBe('bob-')
  })

  test('returns an empty query for an empty token or characters a name cannot have', () => {
    expect(getCategorySuggestionQuery('', false)).toBe('')
    expect(getCategorySuggestionQuery('life,', true)).toBe('')
    expect(getCategorySuggestionQuery('two words', false)).toBe('')
    expect(getCategorySuggestionQuery('a'.repeat(51), false)).toBe('')
  })
})
