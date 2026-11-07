import { describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { createInitialQuoteFormState } from '@/utils/quote-form'
import { QuoteForm } from './quote-form.jsx'

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
