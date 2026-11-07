import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NO_ACTIVE_OPTION } from '@/constants'
import { CategorySuggestions } from './category-suggestions.jsx'

const options = [
  { name: 'leadership', id: 'category-suggestions-leadership' },
  { name: 'learning', id: 'category-suggestions-learning' },
]

const renderList = (props = {}) =>
  render(
    <CategorySuggestions
      id="category-suggestions"
      label="Category"
      options={options}
      activeIndex={NO_ACTIVE_OPTION}
      isExpanded
      onSelect={vi.fn()}
      {...props}
    />,
  )

describe('Category Suggestions', () => {
  test('is a listbox named after the field with an option per suggestion', () => {
    renderList()

    const listbox = screen.getByRole('listbox', { name: 'Category suggestions' })

    expect(listbox).toHaveAttribute('id', 'category-suggestions')
    expect(
      screen.getAllByRole('option').map(({ textContent }) => textContent),
    ).toEqual(['leadership', 'learning'])
    expect(screen.getByRole('option', { name: 'learning' })).toHaveAttribute(
      'id',
      'category-suggestions-learning',
    )
  })

  test('is hidden while it is not expanded', () => {
    renderList({ isExpanded: false })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('marks only the active option as selected', () => {
    renderList({ activeIndex: 1 })

    expect(screen.getByRole('option', { name: 'leadership' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
    expect(screen.getByRole('option', { name: 'learning' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  test('picks the clicked option', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderList({ onSelect })

    await user.click(screen.getByRole('option', { name: 'learning' }))

    expect(onSelect).toHaveBeenCalledWith('learning')
  })
})
