import { describe, expect, test } from 'vitest'
import { createSearchFormState } from './search-form-state.util.js'

describe('Search Form State', () => {
  test('starts with the given values, no errors and no shown error', () => {
    const searchValues = {
      text: 'life',
      author: '',
      category: '',
      limit: '',
      offset: '',
    }

    expect(createSearchFormState(searchValues)).toEqual({
      searchValues,
      validationErrors: {},
      showError: false,
    })
  })
})
