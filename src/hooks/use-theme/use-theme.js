import { useEffect, useSyncExternalStore } from 'react'
import { HEAD_OBSERVER_OPTIONS, THEMES } from '@/constants'
import { applyTheme } from '@/utils/apply-theme'
import { resolveTheme } from '@/utils/resolve-theme'
import { getIsSystemDark, subscribeToSystemScheme } from '@/utils/system-scheme'
import {
  readStoredTheme,
  saveTheme,
  subscribeToStoredTheme,
} from '@/utils/theme-storage'

function getServerTheme() {
  return THEMES.SYSTEM
}

function getServerIsSystemDark() {
  return false
}

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

  useEffect(() => {
    const syncTheme = () => applyTheme(resolvedTheme)
    const headObserver = new MutationObserver(syncTheme)

    syncTheme()
    headObserver.observe(document.head, HEAD_OBSERVER_OPTIONS)

    return () => headObserver.disconnect()
  }, [resolvedTheme])

  return { theme, resolvedTheme, setTheme: saveTheme }
}
