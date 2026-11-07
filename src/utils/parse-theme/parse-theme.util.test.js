import { describe, expect, test } from 'vitest'
import { THEMES } from '@/constants'
import { parseTheme } from './parse-theme.util.js'

describe('parseTheme', () => {
  test.each(Object.values(THEMES))('keeps the valid theme %s', (theme) => {
    expect(parseTheme(theme)).toBe(theme)
  })

  test.each([null, undefined, '', 'sepia', 'DARK', 1])(
    'falls back to system for %s',
    (value) => {
      expect(parseTheme(value)).toBe(THEMES.SYSTEM)
    },
  )
})
