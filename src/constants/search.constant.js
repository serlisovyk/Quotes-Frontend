export const ALLOWED_SEARCH_PARAM_NAMES = [
  'text',
  'author',
  'category',
  'limit',
  'offset',
]

export const ALLOWED_CATEGORIES_PARAM_NAMES = ['name', 'limit', 'offset']

export const ALLOWED_API_QUERY_PARAM_NAMES = [
  ...new Set([...ALLOWED_SEARCH_PARAM_NAMES, ...ALLOWED_CATEGORIES_PARAM_NAMES]),
]

export const INITIAL_SEARCH_VALUES = {
  text: '',
  author: '',
  category: '',
  limit: '',
  offset: '',
}

export const DEFAULT_SEARCH_LIMIT = 10

export const DEFAULT_SEARCH_OFFSET = 0

export const MAX_SEARCH_LIMIT = 50
