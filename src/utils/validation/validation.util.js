import {
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_NAME_REGEX,
  MAX_CATEGORIES_PER_QUOTE,
  MAX_ENTITY_ID,
  MAX_SEARCH_LIMIT,
  MIN_CATEGORIES_PER_QUOTE,
  QUOTE_AUTHOR_MAX_LENGTH,
  QUOTE_AUTHOR_MIN_LENGTH,
  QUOTE_ID_REGEX,
  QUOTE_TEXT_MAX_LENGTH,
  QUOTE_TEXT_MIN_LENGTH,
  VALIDATION_MESSAGE,
} from '@/constants'

function splitCategoryNames(categories) {
  return categories.split(',').map((category) => category.trim())
}

function isLengthOutside(value, minLength, maxLength) {
  return value.length < minLength || value.length > maxLength
}

function getCategoriesError(categories) {
  const hasCategories = Boolean(categories.trim())

  if (!hasCategories) return VALIDATION_MESSAGE.QUOTE_CATEGORIES

  const names = splitCategoryNames(categories)
  const hasTooManyCategories = names.length > MAX_CATEGORIES_PER_QUOTE

  if (hasTooManyCategories) return VALIDATION_MESSAGE.QUOTE_CATEGORIES

  const invalidNames = names.filter((name) => !CATEGORY_NAME_REGEX.test(name))
  const hasInvalidNames = invalidNames.length > 0

  if (hasInvalidNames) return VALIDATION_MESSAGE.INVALID_CATEGORIES(invalidNames)

  const hasTooLongName = names.some((name) => name.length > CATEGORY_NAME_MAX_LENGTH)

  if (hasTooLongName) return VALIDATION_MESSAGE.CATEGORY_NAME_TOO_LONG
}

export function getQuoteFormValidationErrors(values) {
  const { text = '', author = '', categories = '' } = values
  const errors = {}

  if (isLengthOutside(text, QUOTE_TEXT_MIN_LENGTH, QUOTE_TEXT_MAX_LENGTH)) {
    errors.text = VALIDATION_MESSAGE.QUOTE_TEXT
  }

  if (isLengthOutside(author, QUOTE_AUTHOR_MIN_LENGTH, QUOTE_AUTHOR_MAX_LENGTH)) {
    errors.author = VALIDATION_MESSAGE.QUOTE_AUTHOR
  }

  const categoriesError = getCategoriesError(categories)

  if (categoriesError) errors.categories = categoriesError

  return errors
}

export function createQuotePayload(values) {
  const { text, author, categories } = values

  return { text, author, categories: splitCategoryNames(categories) }
}

export function getSearchInputValidationMessage(name, value) {
  if (!value) return

  if (name === 'category' && !CATEGORY_NAME_REGEX.test(value)) {
    return VALIDATION_MESSAGE.SEARCH_CATEGORY
  }

  if (name === 'limit') {
    const limit = Number(value)
    const isLimitValid =
      Number.isInteger(limit) && limit >= 1 && limit <= MAX_SEARCH_LIMIT

    if (!isLimitValid) return VALIDATION_MESSAGE.SEARCH_LIMIT
  }

  if (name === 'offset') {
    const offset = Number(value)
    const isOffsetValid = Number.isInteger(offset) && offset >= 0

    if (!isOffsetValid) return VALIDATION_MESSAGE.SEARCH_OFFSET
  }
}

export function getSearchValidationErrors(searchValues) {
  const errors = {}

  Object.entries(searchValues).forEach(([name, value]) => {
    const message = getSearchInputValidationMessage(name, value)

    if (message) errors[name] = message
  })

  return errors
}

export function isQuoteValidId(id) {
  const idText = String(id)

  if (!QUOTE_ID_REGEX.test(idText)) return false

  const numericId = Number(idText)

  return numericId > 0 && numericId <= MAX_ENTITY_ID
}
