import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useCategorySuggestions } from '@/hooks/use-category-suggestions'
import { FormField } from './form-field.jsx'

vi.mock('@/hooks/use-category-suggestions', () => ({
  useCategorySuggestions: vi.fn(() => []),
}))

describe('Form Field', () => {
  test('renders a text input by default', () => {
    render(<FormField id="author" label="Author" value="" onChange={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Author' })).toBeVisible()
  })

  test('renders a select for the select control', () => {
    render(
      <FormField
        id="limit"
        label="Limit"
        control="select"
        options={[10, 20]}
        value="10"
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Limit' })).toBeVisible()
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })

  test('renders a category combobox for the category control', () => {
    useCategorySuggestions.mockReturnValue([])
    render(
      <FormField
        id="category"
        label="Category"
        control="category"
        value=""
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Category' })).toBeVisible()
  })

  test('passes isMultiple to the category combobox', () => {
    useCategorySuggestions.mockReturnValue([])
    render(
      <FormField
        id="categories"
        label="Categories"
        control="category"
        isMultiple
        value="life, lea"
        onChange={vi.fn()}
      />,
    )

    expect(useCategorySuggestions).toHaveBeenCalledWith('lea')
  })
})
