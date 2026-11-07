import { useEffect, useSyncExternalStore } from 'react'
import { THEMES } from '@/constants'
import { applyTheme } from '@/utils/apply-theme'
import { resolveTheme } from '@/utils/resolve-theme'
import { getIsSystemDark, subscribeToSystemScheme } from '@/utils/system-scheme'
import {
  readStoredTheme,
  saveTheme,
  subscribeToStoredTheme,
} from '@/utils/theme-storage'

const getServerTheme = () => THEMES.SYSTEM

const getServerIsSystemDark = () => false

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeToStoredTheme,
    readStoredTheme,
    getServerTheme,
  )
  const isSystemDark = useSyncExternalStore(
    subscribeToSystemScheme,
    getIsSystemDark,
    getServerIsSystemDark,
  )

  const resolvedTheme = resolveTheme(theme, isSystemDark)

  useEffect(() => applyTheme(resolvedTheme), [resolvedTheme])

  return { theme, resolvedTheme, setTheme: saveTheme }
}
