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

const mockNotFound = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
)

const mockConfig = vi.hoisted(() => ({ isReadOnly: false }))

vi.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

vi.mock('@/config', () => ({
  get IS_READ_ONLY() {
    return mockConfig.isReadOnly
  },
}))

describe('Create quote page in read-only mode', () => {
  test('calls notFound instead of rendering the form', () => {
    mockConfig.isReadOnly = true

    expect(() => CreateQuotePage()).toThrow('NEXT_NOT_FOUND')

    mockConfig.isReadOnly = false
  })
})

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
