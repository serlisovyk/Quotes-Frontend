import 'server-only'

import { fetcher } from '@/services/fetcher'
import { createSearchQueryString } from '@/utils/query-string'
import { ALLOWED_CATEGORIES_PARAM_NAMES, CATEGORIES_API_ENDPOINT } from '@/constants'

export const fetchCategories = (queryParams = {}) => {
  const queryString = createSearchQueryString(
    queryParams,
    ALLOWED_CATEGORIES_PARAM_NAMES,
  )

  return fetcher.get(CATEGORIES_API_ENDPOINT, queryString, { cache: 'no-store' })
}

export const fetchCategoriesResult = async (queryParams = {}) => {
  try {
    const response = await fetchCategories(queryParams)

    return {
      categories: response.categories || [],
      total: response.total || 0,
      hasError: false,
    }
  } catch {
    return {
      categories: [],
      total: 0,
      hasError: true,
    }
  }
}
