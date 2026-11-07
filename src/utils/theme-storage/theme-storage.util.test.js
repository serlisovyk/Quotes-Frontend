import { beforeEach, describe, expect, test, vi } from 'vitest'
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY, THEMES } from '@/constants'
import {
  readStoredTheme,
  saveTheme,
  subscribeToStoredTheme,
} from './theme-storage.util.js'

const blockStorage = (method) =>
  vi.spyOn(Storage.prototype, method).mockImplementation(() => {
    throw new Error('blocked')
  })

describe('theme storage', () => {
  beforeEach(() => localStorage.clear())

  test('reads system when nothing is saved', () => {
    expect(readStoredTheme()).toBe(THEMES.SYSTEM)
  })

  test('reads the saved theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, THEMES.DARK)

    expect(readStoredTheme()).toBe(THEMES.DARK)
  })

  test('reads system for an unknown saved value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia')

    expect(readStoredTheme()).toBe(THEMES.SYSTEM)
  })

  test('keeps the choice for the page when the storage throws', () => {
    blockStorage('getItem')
    blockStorage('setItem')

    saveTheme(THEMES.DARK)

    expect(readStoredTheme()).toBe(THEMES.DARK)
  })

  test('saves the theme and tells the subscribers', () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeToStoredTheme(onChange)

    saveTheme(THEMES.LIGHT)

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(THEMES.LIGHT)
    expect(onChange).toHaveBeenCalledTimes(1)
    unsubscribe()
  })

  test('still tells the subscribers when the storage throws', () => {
    blockStorage('setItem')
    const onChange = vi.fn()
    const unsubscribe = subscribeToStoredTheme(onChange)

    saveTheme(THEMES.LIGHT)

    expect(onChange).toHaveBeenCalledTimes(1)
    unsubscribe()
  })

  test('tells the subscribers about a change made in another tab', () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeToStoredTheme(onChange)

    window.dispatchEvent(new Event('storage'))

    expect(onChange).toHaveBeenCalledTimes(1)
    unsubscribe()
  })

  test('stops telling the subscribers after unsubscribe', () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeToStoredTheme(onChange)
    unsubscribe()

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
    window.dispatchEvent(new Event('storage'))

    expect(onChange).not.toHaveBeenCalled()
  })
})
