export const API_URL = process.env.NEXT_PUBLIC_API_URL

export const ALLOWED_SEARCH_PARAM_NAMES = [
  'text',
  'author',
  'category',
  'limit',
  'offset',
]

export const INITIAL_FORM_VALUES = {
  text: '',
  author: '',
  categories: '',
}

export const INITIAL_SEARCH_VALUES = {
  text: '',
  author: '',
  category: '',
  limit: '',
  offset: '',
}

export const ROUTES = {
  HOME: '/',
  QUOTES: '/quotes',
  RANDOM: '/random',
  SEARCH: '/search',
  CREATE: '/quotes/create',
}

export const menuItems = [
  { href: ROUTES.HOME, text: 'Home' },
  { href: ROUTES.RANDOM, text: 'Random' },
  { href: ROUTES.SEARCH, text: 'Search' },
  { href: ROUTES.CREATE, text: 'Create New' },
]

export const CATEGORY_NAME_REGEX = /^[a-z0-9\-]+$/

export const QUOTES_API_ENDPOINT = 'quotes'

export const RANDOM_QUOTES_API_ENDPOINT = 'quotes/random'

export const DEFAULT_SEARCH_LIMIT = 10

export const DEFAULT_SEARCH_OFFSET = 0

export const MAX_VISIBLE_CATEGORIES = 10

export const MAX_VISIBLE_TEXT_LENGTH = 200

export const MY_QUOTE_ID = 418402

export const HIGHLIGHT_STYLES =
  'bg-yellow-300 dark:bg-yellow-200 dark:text-gray-800 -m-0.5 p-0.5'
