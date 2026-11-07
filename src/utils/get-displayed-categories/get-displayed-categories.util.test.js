import { describe, expect, test } from 'vitest'
import { MAX_VISIBLE_CATEGORIES } from '@/constants'
import { getDisplayedCategories } from './get-displayed-categories.util.js'

const createCategories = (count) =>
  Array.from({ length: count }, (_, index) => `tag-${index + 1}`)

describe('Get Displayed Categories', () => {
  test('returns every category on the single quote page', () => {
    const categories = createCategories(MAX_VISIBLE_CATEGORIES + 5)

    expect(getDisplayedCategories(categories, undefined, true)).toEqual(categories)
  })

  test('returns all categories when they fit the limit', () => {
    expect(getDisplayedCategories(['life', 'hope'])).toEqual(['life', 'hope'])
  })

  test('cuts the list to the limit', () => {
    const categories = createCategories(MAX_VISIBLE_CATEGORIES + 3)

    expect(getDisplayedCategories(categories)).toEqual(
      categories.slice(0, MAX_VISIBLE_CATEGORIES),
    )
  })

  test('keeps the list as it is when the selected category is already visible', () => {
    const categories = createCategories(MAX_VISIBLE_CATEGORIES + 3)

    expect(getDisplayedCategories(categories, 'tag-2')).toEqual(
      categories.slice(0, MAX_VISIBLE_CATEGORIES),
    )
  })

  test('puts a hidden selected category in place of the last visible one', () => {
    const categories = createCategories(MAX_VISIBLE_CATEGORIES + 3)
    const hiddenCategory = categories.at(-1)

    const displayed = getDisplayedCategories(categories, hiddenCategory)

    expect(displayed).toHaveLength(MAX_VISIBLE_CATEGORIES)
    expect(displayed.at(-1)).toBe(hiddenCategory)
    expect(displayed.slice(0, -1)).toEqual(
      categories.slice(0, MAX_VISIBLE_CATEGORIES - 1),
    )
  })

  test('ignores a selected category the quote does not have', () => {
    const categories = createCategories(MAX_VISIBLE_CATEGORIES + 3)

    expect(getDisplayedCategories(categories, 'unknown')).toEqual(
      categories.slice(0, MAX_VISIBLE_CATEGORIES),
    )
  })
})
