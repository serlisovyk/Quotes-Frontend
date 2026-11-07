import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('Quote Form', () => {
  test('shows the title it is given as the page heading', () => {
    renderQuoteForm({ title: 'Create New Quote', buttonText: 'Save' })

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create New Quote' }),
    ).toBeTruthy()
  })

  test('shows the given title whatever the button says', () => {
    renderQuoteForm({ title: 'Edit Quote', buttonText: 'Create' })

    expect(
      screen.getByRole('heading', { level: 1, name: 'Edit Quote' }),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Create' })).toBeTruthy()
  })
})
