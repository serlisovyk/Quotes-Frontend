import { describe, expect, test, vi } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCategorySuggestions } from '@/hooks/use-category-suggestions'
import { CategoryField } from './category-field.jsx'

vi.mock('@/hooks/use-category-suggestions', () => ({
  useCategorySuggestions: vi.fn(),
}))

const SUGGESTIONS = ['leadership', 'learning']

function Harness({ initialValue = '', isMultiple = false, onValueChange }) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (event) => {
    setValue(event.target.value)
    onValueChange?.(event.target.value)
  }

  return (
    <CategoryField
      id="category"
      label="Category"
      placeholder="e.g. leadership"
      value={value}
      onChange={handleChange}
      isMultiple={isMultiple}
    />
  )
}

const renderField = (props = {}) => {
  useCategorySuggestions.mockImplementation((query) => (query ? SUGGESTIONS : []))

  return render(<Harness {...props} />)
}

const getInput = () => screen.getByRole('combobox', { name: 'Category' })

describe('Category Field', () => {
  test('is a combobox with the list popup wiring', () => {
    renderField()

    expect(getInput()).toHaveAttribute('aria-autocomplete', 'list')
    expect(getInput()).toHaveAttribute('aria-expanded', 'false')
    expect(getInput()).toHaveAttribute('aria-controls', 'category-suggestions')
    expect(getInput()).not.toHaveAttribute('aria-activedescendant')
    expect(getInput()).toHaveAttribute('autocomplete', 'off')
  })

  test('keeps the visible label and the placeholder example', () => {
    renderField()

    expect(screen.getByText('Category', { selector: 'label' })).toBeVisible()
    expect(getInput()).toHaveAttribute('placeholder', 'e.g. leadership')
  })

  test('shows the suggestions in a listbox while the user types', async () => {
    const user = userEvent.setup()
    renderField()

    await user.type(getInput(), 'lea')

    expect(getInput()).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('listbox', { name: 'Category suggestions' }),
    ).toBeVisible()
    expect(
      screen.getAllByRole('option').map(({ textContent }) => textContent),
    ).toEqual(SUGGESTIONS)
  })

  test('shows nothing when there are no suggestions', async () => {
    const user = userEvent.setup()
    useCategorySuggestions.mockReturnValue([])
    render(<Harness />)

    await user.type(getInput(), 'zzz')

    expect(getInput()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  test('moves through the options with the arrow keys and points to the active one', async () => {
    const user = userEvent.setup()
    renderField()
    await user.type(getInput(), 'lea')

    await user.keyboard('{ArrowDown}')
    expect(getInput()).toHaveAttribute(
      'aria-activedescendant',
      'category-suggestions-leadership',
    )
    expect(screen.getByRole('option', { name: 'leadership' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await user.keyboard('{ArrowDown}')
    expect(getInput()).toHaveAttribute(
      'aria-activedescendant',
      'category-suggestions-learning',
    )

    await user.keyboard('{ArrowUp}')
    expect(getInput()).toHaveAttribute(
      'aria-activedescendant',
      'category-suggestions-leadership',
    )
  })

  test('Enter picks the active option and closes the list', async () => {
    const user = userEvent.setup()
    renderField()
    await user.type(getInput(), 'lea')

    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    expect(getInput()).toHaveValue('learning')
    expect(getInput()).toHaveAttribute('aria-expanded', 'false')
    expect(getInput()).toHaveFocus()
  })

  test('Escape closes the list and keeps what was typed', async () => {
    const user = userEvent.setup()
    renderField()
    await user.type(getInput(), 'lea')

    await user.keyboard('{Escape}')

    expect(getInput()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(getInput()).toHaveValue('lea')
  })

  test('a click on an option picks it and keeps the focus in the input', async () => {
    const user = userEvent.setup()
    renderField()
    await user.type(getInput(), 'lea')

    await user.click(screen.getByRole('option', { name: 'leadership' }))

    expect(getInput()).toHaveValue('leadership')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(getInput()).toHaveFocus()
  })

  test('leaving the field closes the list', async () => {
    const user = userEvent.setup()
    renderField()
    await user.type(getInput(), 'lea')

    await user.tab()

    expect(getInput()).toHaveAttribute('aria-expanded', 'false')
  })

  test('completes only the text after the last comma in a list', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderField({ isMultiple: true, onValueChange })
    await user.type(getInput(), 'life, love, lea')

    await user.click(screen.getByRole('option', { name: 'leadership' }))

    expect(getInput()).toHaveValue('life, love, leadership')
    expect(onValueChange).toHaveBeenLastCalledWith('life, love, leadership')
  })

  test('asks for suggestions of the text after the last comma', async () => {
    const user = userEvent.setup()
    renderField({ isMultiple: true })

    await user.type(getInput(), 'life, lea')

    expect(useCategorySuggestions).toHaveBeenLastCalledWith('lea')
  })

  test('marks the field invalid and links its error when the error is shown', () => {
    useCategorySuggestions.mockReturnValue([])
    render(
      <CategoryField
        id="category"
        label="Category"
        value=""
        onChange={vi.fn()}
        error="Category can only contain letters, numbers and dashes."
        showError
      />,
    )

    expect(getInput()).toBeInvalid()
    expect(getInput()).toHaveAccessibleDescription(
      'Category can only contain letters, numbers and dashes.',
    )
  })

  test('clearing the field empties it through the clear button', async () => {
    const user = userEvent.setup()
    renderField({ initialValue: 'lea' })

    await user.click(screen.getByRole('button', { name: 'Clear Category' }))

    expect(getInput()).toHaveValue('')
  })
})
