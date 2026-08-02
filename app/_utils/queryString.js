import { ALLOWED_SEARCH_PARAM_NAMES } from '@config/constants'

export const createSearchQueryString = (queryParams = {}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([key, value]) =>
        ALLOWED_SEARCH_PARAM_NAMES.includes(key) &&
        value !== undefined &&
        value !== null &&
        value !== ''
    )
  )

  return new URLSearchParams(filteredParams).toString()
}

export const createSearchValuesFromQueryString = (searchParams) => {
  return ALLOWED_SEARCH_PARAM_NAMES.reduce((acc, searchParamName) => {
    const value = searchParams.get(searchParamName)
    if (value) {
      acc[searchParamName] = value
    }
    return acc
  }, {})
}
