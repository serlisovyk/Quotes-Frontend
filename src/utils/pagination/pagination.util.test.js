import { describe, expect, test } from 'vitest'
import {
  alignOffset,
  alignQueryParams,
  createPageHref,
  getPaginationPages,
} from './pagination.util.js'

describe('alignOffset utility function', () => {
  test('keeps an offset that is a multiple of the limit', () => {
    expect(alignOffset('20', 10)).toBe(20)
    expect(alignOffset(0, 10)).toBe(0)
  })

  test('aligns an uneven offset down to a multiple of the limit', () => {
    expect(alignOffset('5', 10)).toBe(0)
    expect(alignOffset('25', 10)).toBe(20)
    expect(alignOffset(14, 5)).toBe(10)
  })

  test('falls back to the first page for a missing, negative or non-numeric offset', () => {
    expect(alignOffset(undefined, 10)).toBe(0)
    expect(alignOffset('-5', 10)).toBe(0)
    expect(alignOffset('abc', 10)).toBe(0)
  })
})

describe('alignQueryParams utility function', () => {
  test('aligns the offset by the limit of the query', () => {
    expect(alignQueryParams({ text: 'life', limit: '20', offset: '35' })).toEqual({
      text: 'life',
      limit: '20',
      offset: '20',
    })
  })

  test('aligns by the default limit when the query has none', () => {
    expect(alignQueryParams({ offset: '15' })).toEqual({ offset: '10' })
  })

  test('returns the query as it is when it has no offset', () => {
    const queryParams = { text: 'life', limit: '20' }

    expect(alignQueryParams(queryParams)).toBe(queryParams)
  })
})

describe('getPaginationPages utility function', () => {
  test('lists every page when there are seven or fewer', () => {
    expect(getPaginationPages(7, 4)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(getPaginationPages(1, 1)).toEqual([1])
  })

  test('shortens the end of a long list near the first page', () => {
    expect(getPaginationPages(20, 1)).toEqual([1, 2, 3, '...', 20])
  })

  test('shortens both sides in the middle of a long list', () => {
    expect(getPaginationPages(20, 10)).toEqual([
      1,
      '...',
      8,
      9,
      10,
      11,
      12,
      '...',
      20,
    ])
  })

  test('shortens the start of a long list near the last page', () => {
    expect(getPaginationPages(20, 20)).toEqual([1, '...', 18, 19, 20])
  })

  test('does not put a separator where no page is skipped', () => {
    expect(getPaginationPages(8, 4)).toEqual([1, 2, 3, 4, 5, 6, '...', 8])
    expect(getPaginationPages(8, 5)).toEqual([1, '...', 3, 4, 5, 6, 7, 8])
  })
})

describe('createPageHref utility function', () => {
  test('links to a page by its offset and keeps the search params', () => {
    const href = createPageHref({ text: 'life', author: 'Seneca' }, 3, 10)

    expect(href).toBe('/search?text=life&author=Seneca&offset=20')
  })

  test('replaces the offset of the current query', () => {
    const href = createPageHref({ text: 'life', offset: '40' }, 2, 5)

    expect(href).toBe('/search?text=life&offset=5')
  })

  test('links to the first page with a zero offset', () => {
    expect(createPageHref({}, 1, 10)).toBe('/search?offset=0')
  })
})
