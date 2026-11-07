import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { fetchRandomQuotesResult } from '@/services/quotes'
import RandomQuotesPage, { dynamic, metadata } from './page'

vi.mock('@/services/quotes', () => ({
  fetchRandomQuotesResult: vi.fn(),
}))

vi.mock('@/components/random-quotes-refresh-button', () => ({
  RandomQuotesRefreshButton: ({ quotes, hasError }) => (
    <div aria-label="Refresh">
      {quotes.length}|{String(hasError)}
    </div>
  ),
}))

describe('Random page', () => {
  test('is always rendered on request', () => {
    expect(dynamic).toBe('force-dynamic')
  })

  test('sets the random quotes metadata', () => {
    expect(metadata.title).toBe('Random Quotes')
    expect(metadata.alternates.canonical).toBe('/random')
  })

  test('hands the fetched quotes to the refresh button under a heading', async () => {
    fetchRandomQuotesResult.mockResolvedValue({
      quotes: [{ id: 1 }, { id: 2 }],
      hasError: false,
    })

    render(await RandomQuotesPage())

    expect(screen.getByRole('heading', { name: 'Random Quotes' })).toBeVisible()
    expect(screen.getByLabelText('Refresh')).toHaveTextContent('2|false')
  })

  test('hands the error flag to the refresh button', async () => {
    fetchRandomQuotesResult.mockResolvedValue({ quotes: [], hasError: true })

    render(await RandomQuotesPage())

    expect(screen.getByLabelText('Refresh')).toHaveTextContent('0|true')
  })
})
