import { describe, expect, test } from 'vitest'
import { createPageHref, getPaginationPages } from './pagination.util.js'

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
