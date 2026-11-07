import { DARK_SCHEME_QUERY } from '@/constants'

export function getIsSystemDark() {
  return matchMedia(DARK_SCHEME_QUERY).matches
}

export function subscribeToSystemScheme(onChange) {
  const queryList = matchMedia(DARK_SCHEME_QUERY)

  queryList.addEventListener('change', onChange)

  return () => queryList.removeEventListener('change', onChange)
}
