import { beforeEach, describe, expect, test } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { act, renderHook } from '@testing-library/react'
import { FAVORITES_STORAGE_KEY } from '@/constants'
import { saveFavorites } from '@/utils/favorites-storage'
import { useFavorites } from './use-favorites.js'

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

describe('useFavorites', () => {
  beforeEach(() => {
    saveFavorites([])
    localStorage.clear()
  })

  test('is ready with no favorites when nothing is saved', () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.isReady).toBe(true)
    expect(result.current.favorites).toEqual([])
  })

  test('starts with the saved favorites', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([second, first]))

    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([second, first])
  })

  test('follows a save made in this page', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => saveFavorites([first]))

    expect(result.current.favorites).toEqual([first])
  })

  test('follows a change made in another tab', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([second]))
      window.dispatchEvent(new Event('storage'))
    })

    expect(result.current.favorites).toEqual([second])
  })

  test('two hooks stay in step', () => {
    const firstHook = renderHook(() => useFavorites())
    const secondHook = renderHook(() => useFavorites())

    act(() => saveFavorites([first]))

    expect(firstHook.result.current.favorites).toEqual([first])
    expect(secondHook.result.current.favorites).toEqual([first])
  })

  test('is not ready on the server, whatever is saved', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([first]))
    const Probe = () => {
      const { favorites, isReady } = useFavorites()

      return `${isReady} ${favorites.length}`
    }

    expect(renderToString(createElement(Probe))).toBe('false 0')
  })
})
