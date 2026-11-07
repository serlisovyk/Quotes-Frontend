'use client'

import { ThemeIcon } from '@/components/theme-icon'
import { useTheme } from '@/hooks/use-theme'
import { getNextTheme } from '@/utils/get-next-theme'
import { THEME_LABELS } from '@/constants'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  const nextTheme = getNextTheme(theme)
  const label = `Theme: ${THEME_LABELS[theme]}. Switch to ${THEME_LABELS[nextTheme]}`

  const switchTheme = () => setTheme(nextTheme)

  return (
    <button
      type="button"
      onClick={switchTheme}
      aria-label={label}
      className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-body transition-colors duration-fast hover:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <ThemeIcon theme={theme} />
    </button>
  )
}
