import 'server-only'

import { fetcher } from '@/services/fetcher'
import { CATEGORIES_API_ENDPOINT } from '@/constants'

export const fetchCategories = (queryParams = {}) =>
  fetcher.get(CATEGORIES_API_ENDPOINT, queryParams, { cache: 'no-store' })

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
