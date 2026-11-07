import { describe, expect, test } from 'vitest'
import { isSameCategory } from './is-same-category.util.js'

describe('Is Same Category', () => {
  test.each([
    ['life', 'life'],
    ['Life', 'life'],
    ['life', 'LIFE'],
  ])('treats %s and %s as the same category', (category, otherCategory) => {
    expect(isSameCategory(category, otherCategory)).toBe(true)
  })

  test('tells different categories apart', () => {
    expect(isSameCategory('life', 'hope')).toBe(false)
  })

  test.each([undefined, null, ''])('is false when one side is %s', (missing) => {
    expect(isSameCategory('life', missing)).toBe(false)
    expect(isSameCategory(missing, 'life')).toBe(false)
  })
})
