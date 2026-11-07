export const THEME_STORAGE_KEY = 'quotes:theme'

export const THEME_CHANGE_EVENT = 'quotes:theme-change'

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

export const THEME_CYCLE = [THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM]

export const THEME_LABELS = {
  [THEMES.LIGHT]: 'Light',
  [THEMES.DARK]: 'Dark',
  [THEMES.SYSTEM]: 'System',
}

export const THEME_COLORS = {
  [THEMES.LIGHT]: '#ffffff',
  [THEMES.DARK]: '#1f2937',
}

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

export const LIGHT_SCHEME_QUERY = '(prefers-color-scheme: light)'

export const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]'

export const THEME_ICON_PATHS = {
  [THEMES.LIGHT]: [
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41',
  ],
  [THEMES.DARK]: ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],
  [THEMES.SYSTEM]: [
    'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    'M8 21h8M12 17v4',
  ],
}
