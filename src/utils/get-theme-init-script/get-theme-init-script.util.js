import { DARK_SCHEME_QUERY, THEME_STORAGE_KEY, THEMES } from '@/constants'

export function getThemeInitScript() {
  const key = JSON.stringify(THEME_STORAGE_KEY)
  const light = JSON.stringify(THEMES.LIGHT)
  const dark = JSON.stringify(THEMES.DARK)
  const query = JSON.stringify(DARK_SCHEME_QUERY)

  const readSaved = `var saved=null;try{saved=localStorage.getItem(${key})}catch(error){saved=null}`
  const isDark = `saved===${dark}||(saved!==${light}&&matchMedia(${query}).matches)`
  const apply = `document.documentElement.dataset.theme=${isDark}?${dark}:${light}`

  return `(function(){${readSaved};${apply}})()`
}
