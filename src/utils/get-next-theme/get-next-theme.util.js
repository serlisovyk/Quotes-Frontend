import { THEME_CYCLE } from '@/constants'

export function getNextTheme(theme) {
  const nextIndex = (THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length

  return THEME_CYCLE[nextIndex]
}
