import { describe, expect, test } from 'vitest'
import {
  createSearchQueryString,
  createSearchValuesFromSearchParamsObject,
} from './query-string.util.js'

describe('createSearchQueryString utility function', () => {
  test('should return a valid query string with allowed params', () => {
    const queryParams = {
      text: 'life',
      author: 'Albert Einstein',
      category: 'inspiration',
      limit: 10,
      offset: 5,
    }

    const result = createSearchQueryString(queryParams)
    expect(result).toBe(
      'text=life&author=Albert+Einstein&category=inspiration&limit=10&offset=5',
    )
  })

  test('should filter out disallowed params', () => {
    const queryParams = {
      text: 'life',
      author: 'Albert Einstein',
      foo: 'bar', // This param is not allowed
    }
    const result = createSearchQueryString(queryParams)
    expect(result).toBe('text=life&author=Albert+Einstein')
  })

  test('should filter out empty string, undefined, and null values', () => {
    const queryParams = {
      text: '',
      author: undefined,
      category: null,
      limit: 10,
    }

    const result = createSearchQueryString(queryParams)
    expect(result).toBe('limit=10')
  })

  test('should return an empty string when no valid params are provided', () => {
    const queryParams = {
      foo: 'bar', // Disallowed param
      bar: 'baz', // Disallowed param
    }

    const result = createSearchQueryString(queryParams)
    expect(result).toBe('')
  })

  test('should keep 0 as param value and not omit it', () => {
    const queryParams = {
      author: 'Alice',
      limit: 50,
      offset: 0,
    }

    const result = createSearchQueryString(queryParams)
    expect(result).toBe('author=Alice&limit=50&offset=0')
  })
})

describe('createSearchValuesFromSearchParamsObject utility function', () => {
  test('creates allowed search values from Next page searchParams object', () => {
    const result = createSearchValuesFromSearchParamsObject({
      text: 'life',
      author: 'Seneca',
      category: 'stoicism',
      limit: '10',
      offset: '20',
      unsupported: 'value',
    })

    expect(result).toEqual({
      text: 'life',
      author: 'Seneca',
      category: 'stoicism',
      limit: '10',
      offset: '20',
    })
  })

  test('uses the first value when a search param contains an array', () => {
    const result = createSearchValuesFromSearchParamsObject({
      text: ['first', 'second'],
      author: '',
      category: undefined,
    })

    expect(result).toEqual({
      text: 'first',
    })
  })
})
