import { beforeEach, describe, expect, test, vi } from 'vitest'
import { FAVORITES_CHANGE_EVENT, FAVORITES_STORAGE_KEY } from '@/constants'
import {
  readStoredFavorites,
  saveFavorites,
  subscribeToStoredFavorites,
} from './favorites-storage.util.js'

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

const blockStorage = (method) =>
  vi.spyOn(Storage.prototype, method).mockImplementation(() => {
    throw new Error('blocked')
  })

describe('favorites storage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    saveFavorites([])
    localStorage.clear()
  })

  test('reads no favorites when nothing is saved', () => {
    expect(readStoredFavorites()).toEqual([])
  })

  test('reads the saved list', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([second, first]))

    expect(readStoredFavorites()).toEqual([second, first])
  })

  test('returns the same list while the stored value is the same', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([first]))

    expect(readStoredFavorites()).toBe(readStoredFavorites())
  })

  test('returns the same empty list while nothing is saved', () => {
    expect(readStoredFavorites()).toBe(readStoredFavorites())
  })

  test('returns a new list after the stored value changes', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([first]))
    const before = readStoredFavorites()

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([second, first]))

    expect(readStoredFavorites()).not.toBe(before)
    expect(readStoredFavorites()).toEqual([second, first])
  })

  test('reads no favorites for broken JSON', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, '{broken')

    expect(readStoredFavorites()).toEqual([])
  })

  test('reads no favorites for a value that is not a list', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, '{"id":1}')

    expect(readStoredFavorites()).toEqual([])
  })

  test('reads no favorites when the storage throws', () => {
    blockStorage('getItem')

    expect(readStoredFavorites()).toEqual([])
  })

  test('saves the list and tells the subscribers', () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeToStoredFavorites(onChange)

    saveFavorites([second, first])

    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY))).toEqual([
      second,
      first,
    ])
    expect(readStoredFavorites()).toEqual([second, first])
    expect(onChange).toHaveBeenCalledTimes(1)
    unsubscribe()
  })

  test('keeps the list for the page when the storage throws on save', () => {
    blockStorage('setItem')
    const onChange = vi.fn()
    const unsubscribe = subscribeToStoredFavorites(onChange)

    saveFavorites([first])

    expect(readStoredFavorites()).toEqual([first])
    expect(onChange).toHaveBeenCalledTimes(1)
    unsubscribe()
  })

  test('reads from the storage again once a save works', () => {
    const setItem = blockStorage('setItem')
    saveFavorites([first])
    setItem.mockRestore()

    saveFavorites([second])

    expect(readStoredFavorites()).toEqual([second])
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY))).toEqual([second])
  })

  test('tells the subscribers about a change made in another tab', () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeToStoredFavorites(onChange)

    window.dispatchEvent(new Event('storage'))

    expect(onChange).toHaveBeenCalledTimes(1)
    unsubscribe()
  })

  test('stops telling the subscribers after unsubscribe', () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeToStoredFavorites(onChange)
    unsubscribe()

    window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT))
    window.dispatchEvent(new Event('storage'))

    expect(onChange).not.toHaveBeenCalled()
  })
})
