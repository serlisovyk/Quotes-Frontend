import { describe, expect, test } from 'vitest'
import { THEMES } from '@/constants'
import { getNextTheme } from './get-next-theme.util.js'

describe('getNextTheme', () => {
  test('goes light, dark, system and back to light', () => {
    expect(getNextTheme(THEMES.LIGHT)).toBe(THEMES.DARK)
    expect(getNextTheme(THEMES.DARK)).toBe(THEMES.SYSTEM)
    expect(getNextTheme(THEMES.SYSTEM)).toBe(THEMES.LIGHT)
  })
})
