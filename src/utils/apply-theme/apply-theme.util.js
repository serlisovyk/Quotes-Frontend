import { THEME_COLOR_META_SELECTOR, THEME_COLORS } from '@/constants'

export function applyTheme(resolvedTheme) {
  document.documentElement.dataset.theme = resolvedTheme

  const metas = document.querySelectorAll(THEME_COLOR_META_SELECTOR)

  metas.forEach((meta) => {
    meta.content = THEME_COLORS[resolvedTheme]
  })
}
