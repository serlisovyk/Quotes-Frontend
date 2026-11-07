import { CATEGORY_NAME_REGEX, MAX_ENTITY_ID, MAX_SEARCH_LIMIT } from '@/constants'

export function getQuoteFormValidationErrors(values) {
  const errors = {}
  const { text, author, categories } = values

  if ((text || '').length < 10) {
    errors.text = 'Text must be at least 10 characters long.'
  }

  if ((author || '').length < 2 || (author || '').length > 255) {
    errors.author = 'Author must be between 2 and 255 characters long.'
  }

  if (!(categories || '').trim()) {
    errors.categories = 'There must be at least one category.'
  } else {
    const categoryArray = categories.split(',').map((category) => category.trim())

    const invalidCategories = categoryArray.filter(
      (category) => !CATEGORY_NAME_REGEX.test(category),
    )

    if (invalidCategories.length > 0) {
      errors.categories = `Invalid categories: ${invalidCategories.join(
        ', ',
      )}. Category names can only contain lowercase letters, numbers, and dashes.`
    }
  }

  return errors
}

export function createQuotePayload(values) {
  return {
    text: values.text,
    author: values.author,
    categories: values.categories.split(',').map((category) => category.trim()),
  }
}

export function getSearchInputValidationMessage(name, value) {
  if (name === 'category' && value && !CATEGORY_NAME_REGEX.test(value)) {
    return 'Category can only contain lowercase letters, numbers, and dashes.'
  }

  if (name === 'limit' && value) {
    const parsedLimit = Number(value)

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > MAX_SEARCH_LIMIT
    ) {
      return `Limit must be in range 1..${MAX_SEARCH_LIMIT}.`
    }
  }

  if (name === 'offset' && value) {
    const parsedOffset = Number(value)

    if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
      return 'Offset must be a positive integer or zero.'
    }
  }
}

export function isQuoteValidId(id) {
  const parsedId = parseInt(id, 10)

  return Number.isInteger(parsedId) && parsedId > 0 && parsedId <= MAX_ENTITY_ID
}
