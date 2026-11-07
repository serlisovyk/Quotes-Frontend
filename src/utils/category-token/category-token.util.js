import { isCategorySearchName } from '@/utils/validation'
import { CATEGORY_SEPARATOR } from '@/constants'

function getLastSeparatorIndex(value, isMultiple) {
  return isMultiple ? value.lastIndexOf(CATEGORY_SEPARATOR) : -1
}

export function getCategoryToken(value, isMultiple) {
  const tokenStart = getLastSeparatorIndex(value, isMultiple) + 1

  return value.slice(tokenStart).trim()
}

export function replaceCategoryToken(value, category, isMultiple) {
  const keptEnd = getLastSeparatorIndex(value, isMultiple) + 1
  const kept = value.slice(0, keptEnd)
  const gap = kept ? ' ' : ''

  return `${kept}${gap}${category}`
}

export function getCategorySuggestionQuery(value, isMultiple) {
  const token = getCategoryToken(value, isMultiple)

  return isCategorySearchName(token) ? token : ''
}
