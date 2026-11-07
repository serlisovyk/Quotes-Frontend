import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { fetchQuotesResult } from '@/services/quotes'
import SearchQuotesPage, { metadata } from './page'

vi.mock('@/services/quotes', () => ({
  fetchQuotesResult: vi.fn(),
}))

vi.mock('@/components/search-form', () => ({
  SearchForm: ({ initialSearchValues }) => (
    <form aria-label="Search form">{JSON.stringify(initialSearchValues)}</form>
  ),
}))

vi.mock('@/components/quotes', () => ({
  Quotes: ({ quotes, selectedCategory, searchText }) => (
    <ul aria-label="Quotes">
      {quotes.length}|{selectedCategory}|{searchText}
    </ul>
  ),
}))

vi.mock('@/components/pagination', () => ({
  Pagination: ({ total, queryParams }) => (
    <nav aria-label="Pages">
      {total}|{JSON.stringify(queryParams)}
    </nav>
  ),
}))

const quote = { id: 1, text: 'Stay sharp', author: 'Someone', categories: [] }

const renderPage = async (searchParams = {}) =>
  render(await SearchQuotesPage({ searchParams: Promise.resolve(searchParams) }))

describe('Search page', () => {
  test('sets the search metadata', () => {
    expect(metadata.title).toBe('Search Quotes')
    expect(metadata.alternates.canonical).toBe('/search')
  })

  test('shows only the form and does not search without params', async () => {
    await renderPage({})

    expect(screen.getByRole('heading', { name: 'Search Quotes' })).toBeVisible()
    expect(screen.getByRole('form', { name: 'Search form' })).toBeVisible()
    expect(fetchQuotesResult).not.toHaveBeenCalled()
    expect(screen.queryByText('No quotes found.')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Quotes')).not.toBeInTheDocument()
  })

  test('ignores params the search does not know', async () => {
    await renderPage({ foo: 'bar' })

    expect(fetchQuotesResult).not.toHaveBeenCalled()
  })

  test('searches with the params and shows the quotes with the pagination', async () => {
    fetchQuotesResult.mockResolvedValue({
      quotes: [quote],
      total: 25,
      hasError: false,
    })

    await renderPage({ text: 'sharp', category: 'life' })

    expect(fetchQuotesResult).toHaveBeenCalledWith({
      text: 'sharp',
      category: 'life',
    })
    expect(screen.getByLabelText('Quotes')).toHaveTextContent('1|life|sharp')
    expect(screen.getByLabelText('Pages')).toHaveTextContent(
      '25|{"text":"sharp","category":"life"}',
    )
  })

  test('searches and highlights a category given in capitals as the lowercase one', async () => {
    fetchQuotesResult.mockResolvedValue({
      quotes: [quote],
      total: 1,
      hasError: false,
    })

    await renderPage({ category: 'Life' })

    expect(fetchQuotesResult).toHaveBeenCalledWith({ category: 'life' })
    expect(screen.getByLabelText('Quotes')).toHaveTextContent('1|life|')
  })

  test('searches with an offset aligned down to the limit and passes it to the pagination', async () => {
    fetchQuotesResult.mockResolvedValue({
      quotes: [quote],
      total: 40,
      hasError: false,
    })

    await renderPage({ text: 'sharp', limit: '10', offset: '5' })

    expect(fetchQuotesResult).toHaveBeenCalledWith({
      text: 'sharp',
      limit: '10',
      offset: '0',
    })
    expect(screen.getByLabelText('Pages')).toHaveTextContent(
      '40|{"text":"sharp","limit":"10","offset":"0"}',
    )
  })

  test('takes the first value of a repeated param', async () => {
    fetchQuotesResult.mockResolvedValue({
      quotes: [quote],
      total: 1,
      hasError: false,
    })

    await renderPage({ text: ['first', 'second'] })

    expect(fetchQuotesResult).toHaveBeenCalledWith({ text: 'first' })
  })

  test('fills the form with the initial values and the params', async () => {
    fetchQuotesResult.mockResolvedValue({ quotes: [], total: 0, hasError: false })

    await renderPage({ author: 'Someone' })

    expect(screen.getByRole('form', { name: 'Search form' })).toHaveTextContent(
      '"author":"Someone"',
    )
  })

  test('says no quotes were found for a search without results', async () => {
    fetchQuotesResult.mockResolvedValue({ quotes: [], total: 0, hasError: false })

    await renderPage({ text: 'nothing' })

    expect(screen.getByText('No quotes found.')).toBeVisible()
    expect(screen.queryByLabelText('Pages')).not.toBeInTheDocument()
  })

  test('shows the error and not the empty message when the request failed', async () => {
    fetchQuotesResult.mockResolvedValue({ quotes: [], total: 0, hasError: true })

    await renderPage({ text: 'sharp' })

    expect(screen.getByText('Error while fetching quotes')).toBeVisible()
    expect(screen.queryByText('No quotes found.')).not.toBeInTheDocument()
  })
})
