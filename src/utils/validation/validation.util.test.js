import {
  createQuotePayload,
  getQuoteFormValidationErrors,
  isQuoteFormValid,
  getSearchInputValidationMessage,
} from './validation.util.js'

describe('isQuoteFormValid utility function', () => {
  let setValidationErrors

  beforeEach(() => (setValidationErrors = jest.fn()))

  test('validates valid input and returns true', () => {
    const values = {
      text: 'This is a valid quote text.',
      author: 'Author Name',
      categories: 'category1, category2',
    }

    const isValid = isQuoteFormValid({ values, setValidationErrors })

    expect(isValid).toBe(true)
    expect(setValidationErrors).toHaveBeenCalledWith({})
  })

  test('returns false if text is too short', () => {
    const values = {
      text: 'Short',
      author: 'Author Name',
      categories: 'category1',
    }

    const isValid = isQuoteFormValid({ values, setValidationErrors })

    expect(isValid).toBe(false)
    expect(setValidationErrors).toHaveBeenCalledWith({
      text: 'Text must be at least 10 characters long.',
    })
  })

  test('returns false if author length is invalid', () => {
    const values = {
      text: 'This is a valid quote text.',
      author: 'A',
      categories: 'category1',
    }

    const isValid = isQuoteFormValid({ values, setValidationErrors })

    expect(isValid).toBe(false)
    expect(setValidationErrors).toHaveBeenCalledWith({
      author: 'Author must be between 2 and 255 characters long.',
    })
  })

  test('returns false if no categories are provided', () => {
    const values = {
      text: 'This is a valid quote text.',
      author: 'Author Name',
      categories: '',
    }

    const isValid = isQuoteFormValid({ values, setValidationErrors })

    expect(isValid).toBe(false)
    expect(setValidationErrors).toHaveBeenCalledWith({
      categories: 'There must be at least one category.',
    })
  })

  test('returns false if categories contain invalid names', () => {
    const values = {
      text: 'This is a valid quote text.',
      author: 'Author Name',
      categories: 'invalid-category@, category2',
    }

    const isValid = isQuoteFormValid({ values, setValidationErrors })

    expect(isValid).toBe(false)
    expect(setValidationErrors).toHaveBeenCalledWith({
      categories:
        'Invalid categories: invalid-category@. Category names can only contain lowercase letters, numbers, and dashes.',
    })
  })

  test('returns false if text, author, and categories are invalid', () => {
    const values = {
      text: 'Short',
      author: 'A',
      categories: '',
    }

    const isValid = isQuoteFormValid({ values, setValidationErrors })

    expect(isValid).toBe(false)
    expect(setValidationErrors).toHaveBeenCalledWith({
      text: 'Text must be at least 10 characters long.',
      author: 'Author must be between 2 and 255 characters long.',
      categories: 'There must be at least one category.',
    })
  })
})

describe('getQuoteFormValidationErrors utility function', () => {
  test('returns empty errors for valid quote values', () => {
    const result = getQuoteFormValidationErrors({
      text: 'This is a valid quote text.',
      author: 'Author Name',
      categories: 'category1, category2',
    })

    expect(result).toEqual({})
  })

  test('returns validation errors without requiring React setters', () => {
    const result = getQuoteFormValidationErrors({
      text: 'Short',
      author: 'A',
      categories: '',
    })

    expect(result).toEqual({
      text: 'Text must be at least 10 characters long.',
      author: 'Author must be between 2 and 255 characters long.',
      categories: 'There must be at least one category.',
    })
  })
})

describe('createQuotePayload utility function', () => {
  test('normalizes category input into trimmed category names', () => {
    const result = createQuotePayload({
      text: 'This is a valid quote text.',
      author: 'Author Name',
      categories: 'category1, category2, category3',
    })

    expect(result).toEqual({
      text: 'This is a valid quote text.',
      author: 'Author Name',
      categories: ['category1', 'category2', 'category3'],
    })
  })
})

describe('getSearchInputValidationMessage utility function', () => {
  test('does not block short text searches because backend accepts them', () => {
    const result = getSearchInputValidationMessage('text', 'ab')
    expect(result).toBeUndefined()
  })

  test('does not block short author searches because backend accepts them', () => {
    const result = getSearchInputValidationMessage('author', 'A')
    expect(result).toBeUndefined()
  })

  test('returns error message for invalid category', () => {
    const result = getSearchInputValidationMessage('category', 'invalid-category@')
    expect(result).toBe(
      'Category can only contain lowercase letters, numbers, and dashes.',
    )
  })

  test('returns no message for valid category', () => {
    const result = getSearchInputValidationMessage('category', 'valid-category')
    expect(result).toBeUndefined()
  })

  test('returns error message for invalid limit', () => {
    const result = getSearchInputValidationMessage('limit', '100')
    expect(result).toBe('Limit must be in range 1..50.')
  })

  test('returns no message for valid limit', () => {
    const result = getSearchInputValidationMessage('limit', '10')
    expect(result).toBeUndefined()
  })

  test('returns error message for invalid offset', () => {
    const result = getSearchInputValidationMessage('offset', '-1')
    expect(result).toBe('Offset must be a positive integer or zero.')
  })

  test('returns no message for valid offset', () => {
    const result = getSearchInputValidationMessage('offset', '0')
    expect(result).toBeUndefined()
  })
})
