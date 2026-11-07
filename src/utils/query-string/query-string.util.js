import { ALLOWED_SEARCH_PARAM_NAMES } from '@/constants'

export const createSearchQueryString = (
  queryParams = {},
  allowedParamNames = ALLOWED_SEARCH_PARAM_NAMES,
) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([key, value]) =>
        allowedParamNames.includes(key) &&
        value !== undefined &&
        value !== null &&
        value !== '',
    ),
  )

  return new URLSearchParams(filteredParams).toString()
}

export const createSearchValuesFromSearchParamsObject = (searchParams = {}) => {
  return ALLOWED_SEARCH_PARAM_NAMES.reduce((acc, searchParamName) => {
    const rawValue = searchParams[searchParamName]
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue

    if (value) {
      acc[searchParamName] =
        searchParamName === 'category' ? value.toLowerCase() : value
    }

    return acc
  }, {})
}
