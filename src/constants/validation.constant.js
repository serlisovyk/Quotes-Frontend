import { MAX_SEARCH_LIMIT } from './search.constant.js'

export const QUOTE_TEXT_MIN_LENGTH = 10

export const QUOTE_TEXT_MAX_LENGTH = 2500

export const QUOTE_AUTHOR_MIN_LENGTH = 2

export const QUOTE_AUTHOR_MAX_LENGTH = 255

export const MIN_CATEGORIES_PER_QUOTE = 1

export const MAX_CATEGORIES_PER_QUOTE = 10

export const CATEGORY_NAME_MAX_LENGTH = 50

export const VALIDATION_MESSAGE = {
  QUOTE_TEXT: `Text must be from ${QUOTE_TEXT_MIN_LENGTH} to ${QUOTE_TEXT_MAX_LENGTH} characters.`,
  QUOTE_AUTHOR: `Author must be from ${QUOTE_AUTHOR_MIN_LENGTH} to ${QUOTE_AUTHOR_MAX_LENGTH} characters.`,
  QUOTE_CATEGORIES: `There must be from ${MIN_CATEGORIES_PER_QUOTE} to ${MAX_CATEGORIES_PER_QUOTE} categories.`,
  CATEGORY_NAME_TOO_LONG: `Category name must be at most ${CATEGORY_NAME_MAX_LENGTH} characters.`,
  INVALID_CATEGORIES: (names) =>
    `Invalid categories: ${names.join(', ')}. Category names can only contain lowercase letters, numbers and dashes.`,
  SEARCH_CATEGORY:
    'Category can only contain lowercase letters, numbers, and dashes.',
  SEARCH_LIMIT: `Limit must be in range 1..${MAX_SEARCH_LIMIT}.`,
  SEARCH_OFFSET: 'Offset must be a positive integer or zero.',
}
