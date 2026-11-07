import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { DARK_SCHEME_QUERY, THEME_STORAGE_KEY, THEMES } from '@/constants'
import { getThemeInitScript } from './get-theme-init-script.util.js'

const stubSystemScheme = (isDark) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query) => ({ matches: isDark && query === DARK_SCHEME_QUERY })),
  )

const runScript = () => new Function(getThemeInitScript())()

describe('getThemeInitScript', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  afterEach(() => vi.unstubAllGlobals())

  test.each([
    [THEMES.LIGHT, true, THEMES.LIGHT],
    [THEMES.DARK, false, THEMES.DARK],
    [THEMES.SYSTEM, true, THEMES.DARK],
    [THEMES.SYSTEM, false, THEMES.LIGHT],
    [null, true, THEMES.DARK],
    [null, false, THEMES.LIGHT],
    ['sepia', true, THEMES.DARK],
  ])('saved %s with a dark system %s sets %s', (saved, isSystemDark, expected) => {
    if (saved) localStorage.setItem(THEME_STORAGE_KEY, saved)
    stubSystemScheme(isSystemDark)

    runScript()

    expect(document.documentElement.dataset.theme).toBe(expected)
  })

  test('follows the system when reading the storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    stubSystemScheme(true)

    runScript()

    expect(document.documentElement.dataset.theme).toBe(THEMES.DARK)
  })
})
