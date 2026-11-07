export const INITIAL_FORM_VALUES = {
  text: '',
  author: '',
  categories: '',
}

export const CATEGORY_NAME_REGEX = /^[a-z0-9-]+$/

export const QUOTE_ID_REGEX = /^\d+$/

export const MAX_ENTITY_ID = 2147483647

export const MAX_VISIBLE_CATEGORIES = 10

export const MAX_VISIBLE_TEXT_LENGTH = 200

export const MIN_HIGHLIGHT_LENGTH = 3

export const INITIAL_DELETE_STATE = { error: '' }

export const HIGHLIGHT_STYLES =
  'bg-yellow-300 dark:bg-yellow-200 dark:text-gray-800 -m-0.5 p-0.5'
