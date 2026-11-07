import { describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCategorySuggestions } from '@/hooks/use-category-suggestions'
import { createInitialQuoteFormState } from '@/utils/quote-form'
import { QuoteForm } from './quote-form.jsx'

vi.mock('@/hooks/use-category-suggestions', () => ({
  useCategorySuggestions: vi.fn(() => []),
}))

const emptyValues = { text: '', author: '', categories: '' }

const renderQuoteForm = (props = {}) =>
  render(
    <QuoteForm
      action={vi.fn()}
      initialState={createInitialQuoteFormState(emptyValues)}
      title="Create New Quote"
      buttonText="Create"
      {...props}
    />,
  )

const createFailingAction = () =>
  vi.fn(async () => ({
    values: { text: 'short', author: 'Someone', categories: 'life' },
    errors: { text: 'Text is too short' },
    formError: 'Could not save the quote',
  }))

const submitForm = () =>
  act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))
  })

describe('Quote Form', () => {
  test('suggests categories for the text after the last comma and completes only that text', async () => {
    const user = userEvent.setup()
    useCategorySuggestions.mockImplementation((query) =>
      query ? ['courage', 'courtesy'] : [],
    )
    renderQuoteForm()
    const categories = screen.getByRole('combobox', {
      name: 'Categories (comma-separated)',
    })

    await user.type(categories, 'life, hope, cou')
    await user.click(screen.getByRole('option', { name: 'courage' }))

    expect(categories).toHaveValue('life, hope, courage')
  })

  test('picks a suggestion with the keyboard without submitting the form', async () => {
    const user = userEvent.setup()
    const action = vi.fn()
    useCategorySuggestions.mockImplementation((query) =>
      query ? ['courage', 'courtesy'] : [],
    )
    renderQuoteForm({ action })
    const categories = screen.getByLabelText('Categories (comma-separated)')

    await user.type(categories, 'cou')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(categories).toHaveValue('courage')
    expect(action).not.toHaveBeenCalled()
  })

  test('gives the other fields no suggestions list', () => {
    renderQuoteForm()

    expect(screen.getAllByRole('combobox')).toHaveLength(1)
  })

  test('shows the title it is given as the page heading', () => {
    renderQuoteForm({ title: 'Create New Quote', buttonText: 'Save' })

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create New Quote' }),
    ).toBeTruthy()
  })

  test('shows the initial values in the fields', () => {
    renderQuoteForm({
      initialState: createInitialQuoteFormState({
        text: 'A quote that is long enough',
        author: 'Someone',
        categories: 'life, hope',
      }),
    })

    expect(screen.getByLabelText('Quote text').value).toBe(
      'A quote that is long enough',
    )
    expect(screen.getByLabelText('Author').value).toBe('Someone')
    expect(screen.getByLabelText('Categories (comma-separated)').value).toBe(
      'life, hope',
    )
  })

  test('shows the errors and the values an action returns', async () => {
    const action = createFailingAction()
    renderQuoteForm({ action })

    await submitForm()

    expect(await screen.findByText('Text is too short')).toBeTruthy()
    expect(screen.getByText('Could not save the quote')).toBeTruthy()
    expect(screen.getByLabelText('Quote text').value).toBe('short')
    expect(screen.getByLabelText('Author').value).toBe('Someone')
    expect(action).toHaveBeenCalledTimes(1)
  })

  test('gives every field a visible label', () => {
    renderQuoteForm()

    for (const label of ['Quote text', 'Author', 'Categories (comma-separated)']) {
      expect(screen.getByText(label, { selector: 'label' })).toBeVisible()
      expect(screen.getByLabelText(label)).toBeVisible()
    }
  })

  test('marks the field invalid and links its error after a failed submit', async () => {
    renderQuoteForm({ action: createFailingAction() })

    await submitForm()

    const textField = await screen.findByLabelText('Quote text')

    expect(textField).toBeInvalid()
    expect(textField).toHaveAccessibleDescription('Text is too short')
    expect(screen.getByLabelText('Author')).toBeValid()
  })

  test('announces the form error as an alert', async () => {
    renderQuoteForm({ action: createFailingAction() })

    await submitForm()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not save the quote',
    )
  })

  test('clears the errors and keeps the typed values when the user types', async () => {
    renderQuoteForm({ action: createFailingAction() })
    await submitForm()
    await screen.findByText('Text is too short')

    fireEvent.change(screen.getByLabelText('Quote text'), {
      target: { value: 'A longer quote text' },
    })

    expect(screen.queryByText('Text is too short')).toBeNull()
    expect(screen.queryByText('Could not save the quote')).toBeNull()
    expect(screen.getByLabelText('Quote text').value).toBe('A longer quote text')
    expect(screen.getByLabelText('Author').value).toBe('Someone')
  })

  test('shows what the user types while there is no action result yet', () => {
    renderQuoteForm()

    fireEvent.change(screen.getByLabelText('Author'), {
      target: { value: 'Seneca' },
    })

    expect(screen.getByLabelText('Author').value).toBe('Seneca')
  })

  test('puts the initial values back on reset', async () => {
    renderQuoteForm({
      initialState: createInitialQuoteFormState({
        text: 'A quote that is long enough',
        author: 'Someone',
        categories: 'life',
      }),
    })

    fireEvent.change(screen.getByLabelText('Author'), {
      target: { value: 'Seneca' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(screen.getByLabelText('Author').value).toBe('Someone')
  })

  test('puts the initial values back on reset after a failed submit', async () => {
    renderQuoteForm({
      action: createFailingAction(),
      initialState: createInitialQuoteFormState({
        text: 'A quote that is long enough',
        author: 'Original',
        categories: 'life',
      }),
    })
    await submitForm()
    await screen.findByText('Text is too short')

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(screen.getByLabelText('Author').value).toBe('Original')
    expect(screen.queryByText('Text is too short')).toBeNull()
  })

  test('shows the given title whatever the button says', () => {
    renderQuoteForm({ title: 'Edit Quote', buttonText: 'Create' })

    expect(
      screen.getByRole('heading', { level: 1, name: 'Edit Quote' }),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Create' })).toBeTruthy()
  })
})
