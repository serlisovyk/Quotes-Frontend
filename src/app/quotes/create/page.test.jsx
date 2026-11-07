import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createQuoteAction } from '@/actions/quote'
import CreateQuotePage, { metadata } from './page'

vi.mock('@/actions/quote', () => ({
  createQuoteAction: vi.fn(),
}))

vi.mock('@/components/quote-form', () => ({
  QuoteForm: ({ action, initialState, title, buttonText }) => (
    <form aria-label={title}>
      <span>{buttonText}</span>
      <span>{JSON.stringify(initialState.values)}</span>
      <span>{String(action === createQuoteAction)}</span>
    </form>
  ),
}))

describe('Create quote page', () => {
  test('is not indexed', () => {
    expect(metadata.robots.index).toBe(false)
  })

  test('renders an empty form bound to the create action', () => {
    render(<CreateQuotePage />)

    const form = screen.getByRole('form', { name: 'Create New Quote' })

    expect(form).toHaveTextContent('Create')
    expect(form).toHaveTextContent('{"text":"","author":"","categories":""}')
    expect(form).toHaveTextContent('true')
  })
})
