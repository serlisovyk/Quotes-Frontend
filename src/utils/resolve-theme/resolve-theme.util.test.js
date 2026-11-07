import { describe, expect, test } from 'vitest'
import { THEMES } from '@/constants'
import { resolveTheme } from './resolve-theme.util.js'

describe('resolveTheme', () => {
  test.each([true, false])(
    'light stays light when the system is dark: %s',
    (isSystemDark) => {
      expect(resolveTheme(THEMES.LIGHT, isSystemDark)).toBe(THEMES.LIGHT)
    },
  )

  test.each([true, false])(
    'dark stays dark when the system is dark: %s',
    (isSystemDark) => {
      expect(resolveTheme(THEMES.DARK, isSystemDark)).toBe(THEMES.DARK)
    },
  )

  test('system follows a dark system', () => {
    expect(resolveTheme(THEMES.SYSTEM, true)).toBe(THEMES.DARK)
  })

  test('system follows a light system', () => {
    expect(resolveTheme(THEMES.SYSTEM, false)).toBe(THEMES.LIGHT)
  })
})
