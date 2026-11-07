import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './page'

const mockFetchQuoteByIdOrNull = vi.hoisted(() => vi.fn())
const mockHome = vi.hoisted(() => ({ homeQuoteId: undefined }))

vi.mock('@/config', () => ({
  get HOME_QUOTE_ID() {
    return mockHome.homeQuoteId
  },
}))

vi.mock('@/services/quotes', () => ({
  fetchQuoteByIdOrNull: (...args) => mockFetchQuoteByIdOrNull(...args),
}))

vi.mock('@/components/quote', () => ({
  Quote: ({ quote }) => <div data-testid="quote">{quote.text}</div>,
}))

const quote = { id: 7, text: 'A quote from the API', author: 'Author' }

const renderHomePage = async (homeQuoteId) => {
  mockHome.homeQuoteId = homeQuoteId

  render(await HomePage())
}

const expectHomeWithoutCard = () => {
  expect(
    screen.getByRole('img', { name: 'Portrait of Winston Churchill' }),
  ).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Random Quotes' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Search Quotes' })).toBeTruthy()
  expect(screen.queryByTestId('quote')).toBeNull()
  expect(screen.queryByText(/error/i)).toBeNull()
}

describe('Home Page', () => {
  test('shows the quote card for the id from HOME_QUOTE_ID', async () => {
    mockFetchQuoteByIdOrNull.mockResolvedValue(quote)

    await renderHomePage('7')

    expect(mockFetchQuoteByIdOrNull).toHaveBeenCalledWith(
      '7',
      expect.objectContaining({ next: expect.any(Object) }),
    )
    expect(screen.getByTestId('quote').textContent).toBe('A quote from the API')
    expect(screen.getByRole('link', { name: 'Random Quotes' })).toBeTruthy()
  })

  test('has one h1, the hero quote, and no skipped heading level', async () => {
    mockFetchQuoteByIdOrNull.mockResolvedValue(quote)

    await renderHomePage('7')

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Success is not final, failure is not fatal',
    )
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  test('renders without the card when HOME_QUOTE_ID is not set', async () => {
    await renderHomePage(undefined)

    expectHomeWithoutCard()
    expect(mockFetchQuoteByIdOrNull).not.toHaveBeenCalled()
  })

  test.each(['', 'abc', '0', '-5', '2147483648'])(
    'renders without the card and skips the API for the invalid id "%s"',
    async (invalidId) => {
      await renderHomePage(invalidId)

      expectHomeWithoutCard()
      expect(mockFetchQuoteByIdOrNull).not.toHaveBeenCalled()
    },
  )

  test('renders without the card when the quote is missing or the API failed', async () => {
    mockFetchQuoteByIdOrNull.mockResolvedValue(null)

    await renderHomePage('7')

    expectHomeWithoutCard()
    expect(mockFetchQuoteByIdOrNull).toHaveBeenCalledTimes(1)
  })

  test('renders without the card when the response has no id', async () => {
    mockFetchQuoteByIdOrNull.mockResolvedValue({})

    await renderHomePage('7')

    expectHomeWithoutCard()
  })
})
