import { THEME_COLOR_META_SELECTOR, THEME_COLORS } from '@/constants'

export function applyTheme(resolvedTheme) {
  const root = document.documentElement
  const color = THEME_COLORS[resolvedTheme]

  if (root.dataset.theme !== resolvedTheme) root.dataset.theme = resolvedTheme

  const metas = document.querySelectorAll(THEME_COLOR_META_SELECTOR)

  metas.forEach((meta) => {
    if (meta.content !== color) meta.content = color
  })
}
