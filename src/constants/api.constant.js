export const DEFAULT_ERROR_MESSAGE = 'Some error occurred'

export const TOO_MANY_REQUESTS_MESSAGE =
  'Too many requests, please try again in a few minutes.'

export const SERVER_NOT_RESPONDING_MESSAGE =
  'The server is not responding, please try again later.'

export const UNREACHABLE_SERVER_ERROR_NAMES = [
  'TimeoutError',
  'AbortError',
  'TypeError',
]

export const QUOTES_API_ENDPOINT = 'quotes'

export const RANDOM_QUOTES_API_ENDPOINT = 'quotes/random'

export const CATEGORIES_API_ENDPOINT = 'categories'

export const API_REQUEST_TIMEOUT_MS = 8000

export const HTTP_STATUS_BAD_REQUEST = 400

export const HTTP_STATUS_NOT_FOUND = 404

export const HTTP_STATUS_TOO_MANY_REQUESTS = 429

export const HTTP_STATUS_BAD_GATEWAY = 502

export const HOME_QUOTE_REVALIDATE_SECONDS = 3600

export const QUOTE_DETAILS_REVALIDATE_SECONDS = 600

export const TRAILING_SLASHES_PATTERN = /\/+$/

export const LEADING_SLASHES_PATTERN = /^\/+/
