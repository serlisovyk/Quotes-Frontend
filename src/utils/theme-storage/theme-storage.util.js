import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY, THEMES } from '@/constants'
import { parseTheme } from '@/utils/parse-theme'

let pageTheme = THEMES.SYSTEM

export function readStoredTheme() {
  try {
    return parseTheme(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return pageTheme
  }
}

const writeStoredTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    return
  }
}

export function saveTheme(theme) {
  pageTheme = theme

  writeStoredTheme(theme)

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
}

export function subscribeToStoredTheme(onChange) {
  window.addEventListener(THEME_CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}
