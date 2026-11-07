import { THEMES } from '@/constants'

export function parseTheme(value) {
  const isKnownTheme = Object.values(THEMES).includes(value)

  if (isKnownTheme) return value

  return THEMES.SYSTEM
}
