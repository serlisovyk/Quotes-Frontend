import { describe, expect, test } from 'vitest'
import { parseFavorites } from './parse-favorites.util.js'

const first = {
  id: 1,
  text: 'Be yourself',
  author: 'Oscar Wilde',
  categories: ['life'],
}
const second = {
  id: 2,
  text: 'Stay hungry',
  author: 'Steve Jobs',
  categories: [],
}

describe('parseFavorites', () => {
  test('returns the saved list in its order', () => {
    expect(parseFavorites(JSON.stringify([second, first]))).toEqual([second, first])
  })

  test.each([[null], [''], ['{broken'], ['null'], ['"text"'], ['42'], ['{"id":1}']])(
    'returns an empty list for %s',
    (raw) => {
      expect(parseFavorites(raw)).toEqual([])
    },
  )

  test('returns an empty list for an empty array', () => {
    expect(parseFavorites('[]')).toEqual([])
  })

  test.each([
    ['null', null],
    ['a string', 'quote'],
    ['no id', { text: 'a', author: 'b', categories: [] }],
    ['a string id', { id: '1', text: 'a', author: 'b', categories: [] }],
    ['a zero id', { id: 0, text: 'a', author: 'b', categories: [] }],
    ['a fractional id', { id: 1.5, text: 'a', author: 'b', categories: [] }],
    ['an empty text', { id: 3, text: '', author: 'b', categories: [] }],
    ['no author', { id: 3, text: 'a', categories: [] }],
    [
      'categories that are not a list',
      { id: 3, text: 'a', author: 'b', categories: 'x' },
    ],
    [
      'a category that is not a string',
      { id: 3, text: 'a', author: 'b', categories: [1] },
    ],
  ])('skips an entry that is %s and keeps the valid ones', (_name, entry) => {
    expect(parseFavorites(JSON.stringify([first, entry, second]))).toEqual([
      first,
      second,
    ])
  })

  test('keeps only the snapshot fields', () => {
    const raw = JSON.stringify([{ ...first, createdAt: 'yesterday' }])

    expect(parseFavorites(raw)).toEqual([first])
  })

  test('keeps the first entry of a repeated id', () => {
    const duplicate = { ...first, text: 'Other text' }

    expect(parseFavorites(JSON.stringify([first, duplicate, second]))).toEqual([
      first,
      second,
    ])
  })
})
