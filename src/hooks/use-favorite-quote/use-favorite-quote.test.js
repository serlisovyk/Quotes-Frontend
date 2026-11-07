import { beforeEach, describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { FAVORITES_STORAGE_KEY } from '@/constants'
import { saveFavorites } from '@/utils/favorites-storage'
import { useFavoriteQuote } from './use-favorite-quote.js'

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

const readSaved = () => JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY))

describe('useFavoriteQuote', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    saveFavorites([])
    localStorage.clear()
  })

  test('is not a favorite when nothing is saved', () => {
    const { result } = renderHook(() => useFavoriteQuote(first))

    expect(result.current.isFavorite).toBe(false)
  })

  test('is a favorite when the quote is saved', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([second, first]))

    const { result } = renderHook(() => useFavoriteQuote(first))

    expect(result.current.isFavorite).toBe(true)
  })

  test('saves the quote on the first toggle and removes it on the second', () => {
    const { result } = renderHook(() => useFavoriteQuote(first))

    act(() => result.current.toggleFavorite())

    expect(result.current.isFavorite).toBe(true)
    expect(readSaved()).toEqual([first])

    act(() => result.current.toggleFavorite())

    expect(result.current.isFavorite).toBe(false)
    expect(readSaved()).toEqual([])
  })

  test('saves only the snapshot of the quote', () => {
    const quote = { ...first, createdAt: 'yesterday' }
    const { result } = renderHook(() => useFavoriteQuote(quote))

    act(() => result.current.toggleFavorite())

    expect(readSaved()).toEqual([first])
  })

  test('keeps what another tab saved in the meantime', () => {
    const { result } = renderHook(() => useFavoriteQuote(first))
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([second]))

    act(() => result.current.toggleFavorite())

    expect(readSaved()).toEqual([first, second])
  })

  test('two cards of one quote stay in step', () => {
    const firstCard = renderHook(() => useFavoriteQuote(first))
    const secondCard = renderHook(() => useFavoriteQuote(first))
    const otherCard = renderHook(() => useFavoriteQuote(second))

    act(() => firstCard.result.current.toggleFavorite())

    expect(secondCard.result.current.isFavorite).toBe(true)
    expect(otherCard.result.current.isFavorite).toBe(false)
  })

  test('works for the page when the storage throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const { result } = renderHook(() => useFavoriteQuote(first))

    act(() => result.current.toggleFavorite())

    expect(result.current.isFavorite).toBe(true)

    act(() => result.current.toggleFavorite())

    expect(result.current.isFavorite).toBe(false)
  })
})
