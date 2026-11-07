import { describe, expect, test, vi } from 'vitest'
import { metadata } from './page'

vi.mock('@/actions/quote', () => ({
  createQuoteAction: vi.fn(),
}))

vi.mock('@/components/quote-form', () => ({ QuoteForm: () => <form /> }))

describe('Create quote page', () => {
  test('is not indexed', () => {
    expect(metadata.robots.index).toBe(false)
  })
})
