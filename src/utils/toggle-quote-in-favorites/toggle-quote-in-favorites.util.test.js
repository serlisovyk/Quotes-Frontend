import { describe, expect, test } from 'vitest'
import { toggleQuoteInFavorites } from './toggle-quote-in-favorites.util.js'

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

describe('toggleQuoteInFavorites', () => {
  test('adds a quote to an empty list', () => {
    expect(toggleQuoteInFavorites([], first)).toEqual([first])
  })

  test('adds a new quote at the front', () => {
    expect(toggleQuoteInFavorites([first], second)).toEqual([second, first])
  })

  test('removes a quote that is already saved', () => {
    expect(toggleQuoteInFavorites([second, first], second)).toEqual([first])
  })

  test('removes the last quote and leaves an empty list', () => {
    expect(toggleQuoteInFavorites([first], first)).toEqual([])
  })

  test('saves only the snapshot fields', () => {
    const quote = { ...first, createdAt: 'yesterday', extra: true }

    expect(toggleQuoteInFavorites([], quote)).toEqual([first])
  })

  test('does not change the list it was given', () => {
    const favorites = [first]

    toggleQuoteInFavorites(favorites, second)
    toggleQuoteInFavorites(favorites, first)

    expect(favorites).toEqual([first])
  })
})
