import { THEMES } from '@/constants'

export function resolveTheme(theme, isSystemDark) {
  if (theme !== THEMES.SYSTEM) return theme

  return isSystemDark ? THEMES.DARK : THEMES.LIGHT
}
