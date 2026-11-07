import { createSearchQueryString } from '@/utils/query-string'
import {
  ALLOWED_CATEGORIES_PARAM_NAMES,
  CATEGORY_SUGGESTIONS_ENDPOINT,
  DEFAULT_ERROR_MESSAGE,
} from '@/constants'

export const fetchCategorySuggestions = async (name, signal) => {
  const query = createSearchQueryString({ name }, ALLOWED_CATEGORIES_PARAM_NAMES)
  const response = await fetch(`${CATEGORY_SUGGESTIONS_ENDPOINT}?${query}`, {
    signal,
  })

  if (!response.ok) throw new Error(DEFAULT_ERROR_MESSAGE)

  const { categories } = await response.json()

  return categories.map(({ name: categoryName }) => categoryName)
}
