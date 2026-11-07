import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MAX_VISIBLE_CATEGORIES } from '@/constants'
import { CategoryTags } from './category-tags.jsx'

const createCategories = (count) =>
  Array.from({ length: count }, (_, index) => `tag-${index + 1}`)

describe('Category Tags', () => {
  test('links every category to the search by that category', () => {
    render(<CategoryTags categories={['life', 'hope']} />)

    expect(screen.getByRole('link', { name: 'life' }).getAttribute('href')).toBe(
      '/search?category=life',
    )
    expect(screen.getByRole('link', { name: 'hope' }).getAttribute('href')).toBe(
      '/search?category=hope',
    )
  })

  test('marks the selected category as current', () => {
    render(<CategoryTags categories={['life', 'hope']} selectedCategory="hope" />)

    expect(
      screen.getByRole('link', { name: 'hope' }).getAttribute('aria-current'),
    ).toBe('true')
    expect(
      screen.getByRole('link', { name: 'life' }).getAttribute('aria-current'),
    ).toBeNull()
  })

  test('marks the selected category as current whatever its case', () => {
    render(<CategoryTags categories={['life', 'hope']} selectedCategory="Life" />)

    expect(
      screen.getByRole('link', { name: 'life' }).getAttribute('aria-current'),
    ).toBe('true')
    expect(
      screen.getByRole('link', { name: 'hope' }).getAttribute('aria-current'),
    ).toBeNull()
  })

  test('shows the first categories and an ellipsis when there are more', () => {
    render(
      <CategoryTags categories={createCategories(MAX_VISIBLE_CATEGORIES + 2)} />,
    )

    expect(screen.getAllByRole('link')).toHaveLength(MAX_VISIBLE_CATEGORIES)
    expect(screen.getByText('...')).toBeTruthy()
  })

  test('shows every category and no ellipsis on a single quote page', () => {
    render(
      <CategoryTags
        categories={createCategories(MAX_VISIBLE_CATEGORIES + 2)}
        isSingleQuotePage
      />,
    )

    expect(screen.getAllByRole('link')).toHaveLength(MAX_VISIBLE_CATEGORIES + 2)
    expect(screen.queryByText('...')).toBeNull()
  })

  test('does not put a stray class name on the list', () => {
    const { container } = render(<CategoryTags categories={['life']} />)

    expect(container.firstElementChild.className).not.toMatch(/false|undefined/)
  })

  test('centers the tags of a single quote page', () => {
    const { container } = render(
      <CategoryTags categories={['life']} isSingleQuotePage />,
    )

    expect(container.firstElementChild.className).toContain('justify-center')
  })
})
