import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { act, renderHook, waitFor } from '@testing-library/react'
import { THEME_COLORS, THEME_STORAGE_KEY, THEMES } from '@/constants'
import { useTheme } from './use-theme.js'

let isSystemDark
let systemListeners

const stubSystemScheme = () => {
  systemListeners = new Set()

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return isSystemDark
      },
      addEventListener: (_event, listener) => systemListeners.add(listener),
      removeEventListener: (_event, listener) => systemListeners.delete(listener),
    })),
  )
}

const changeSystemScheme = (isDark) => {
  isSystemDark = isDark
  act(() => systemListeners.forEach((listener) => listener()))
}

describe('useTheme', () => {
  beforeEach(() => {
    isSystemDark = false
    stubSystemScheme()
    localStorage.clear()
    document.head.innerHTML = '<meta name="theme-color" content="#000000">'
    delete document.documentElement.dataset.theme
  })

  afterEach(() => vi.unstubAllGlobals())

  test('starts as system and resolves it from a light system', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe(THEMES.SYSTEM)
    expect(result.current.resolvedTheme).toBe(THEMES.LIGHT)
  })

  test('resolves system from a dark system', () => {
    isSystemDark = true

    const { result } = renderHook(() => useTheme())

    expect(result.current.resolvedTheme).toBe(THEMES.DARK)
  })

  test('starts with the saved theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, THEMES.DARK)

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe(THEMES.DARK)
    expect(result.current.resolvedTheme).toBe(THEMES.DARK)
  })

  test('setTheme saves the choice and updates the hook', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setTheme(THEMES.DARK))

    expect(result.current.theme).toBe(THEMES.DARK)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(THEMES.DARK)
  })

  test('writes data-theme and the theme-color meta', () => {
    const { result } = renderHook(() => useTheme())

    expect(document.documentElement.dataset.theme).toBe(THEMES.LIGHT)

    act(() => result.current.setTheme(THEMES.DARK))

    expect(document.documentElement.dataset.theme).toBe(THEMES.DARK)
    expect(document.querySelector('meta[name="theme-color"]').content).toBe(
      THEME_COLORS.dark,
    )
  })

  test('system follows the operating system while it is chosen', () => {
    const { result } = renderHook(() => useTheme())

    changeSystemScheme(true)

    expect(result.current.resolvedTheme).toBe(THEMES.DARK)
    expect(document.documentElement.dataset.theme).toBe(THEMES.DARK)
  })

  test('an explicit choice ignores the operating system', () => {
    localStorage.setItem(THEME_STORAGE_KEY, THEMES.LIGHT)
    const { result } = renderHook(() => useTheme())

    changeSystemScheme(true)

    expect(result.current.resolvedTheme).toBe(THEMES.LIGHT)
  })

  test('two hooks stay in step', () => {
    const first = renderHook(() => useTheme())
    const second = renderHook(() => useTheme())

    act(() => first.result.current.setTheme(THEMES.DARK))

    expect(second.result.current.theme).toBe(THEMES.DARK)
  })

  test('puts the colour back when the page replaces the theme-color meta', async () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme(THEMES.DARK))

    document.head.innerHTML = '<meta name="theme-color" content="#ffffff">'

    await waitFor(() =>
      expect(document.querySelector('meta[name="theme-color"]').content).toBe(
        THEME_COLORS.dark,
      ),
    )
  })

  test('renders system and light on the server, whatever is saved', () => {
    localStorage.setItem(THEME_STORAGE_KEY, THEMES.DARK)
    const Probe = () => {
      const { theme, resolvedTheme } = useTheme()

      return `${theme} ${resolvedTheme}`
    }

    expect(renderToString(createElement(Probe))).toBe('system light')
  })
})
