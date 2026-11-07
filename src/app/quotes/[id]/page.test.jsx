import { describe, expect, test, vi } from 'vitest'
import { render } from '@testing-library/react'
import { fetchQuoteIfExists } from '@/services/quotes'
import QuotePage, { generateMetadata } from './page'

const mockNotFound = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
)

vi.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

vi.mock('@/services/quotes', () => ({
  fetchQuoteIfExists: vi.fn(),
}))

vi.mock('@/components/category-tags', () => ({ CategoryTags: () => <div /> }))
vi.mock('@/components/delete-quote-button', () => ({
  DeleteQuoteButton: () => <div />,
}))

const renderPage = async (quote) => {
  fetchQuoteIfExists.mockResolvedValue(quote)

  const page = await QuotePage({ params: Promise.resolve({ id: String(quote.id) }) })

  return render(page)
}

describe('Quote page author link', () => {
  test.each([
    ['A & B', '/search?author=A+%26+B'],
    ['C#', '/search?author=C%23'],
    ['x+y', '/search?author=x%2By'],
    ['Albert Einstein', '/search?author=Albert+Einstein'],
  ])('encodes the author %s', async (author, href) => {
    const { getByRole } = await renderPage({
      id: 1,
      text: 'Some text',
      author,
      categories: [],
    })

    expect(
      getByRole('link', { name: `Quotes by ${author}` }).getAttribute('href'),
    ).toBe(href)
  })
})

describe('Quote page metadata', () => {
  test('names the quote by its id and points the canonical URL at it', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ id: '7' }) })

    expect(metadata.title).toBe('Quote #7')
    expect(metadata.alternates.canonical).toBe('/quotes/7')
  })
})

describe('Quote page not found and errors', () => {
  const renderWithId = (id) => QuotePage({ params: Promise.resolve({ id }) })

  test.each(['abc', '0', '-5', '2147483648'])(
    'calls notFound for the invalid id "%s" without calling the API',
    async (invalidId) => {
      await expect(renderWithId(invalidId)).rejects.toThrow('NEXT_NOT_FOUND')

      expect(fetchQuoteIfExists).not.toHaveBeenCalled()
    },
  )

  test('calls notFound when the quote does not exist', async () => {
    fetchQuoteIfExists.mockResolvedValue(null)

    await expect(renderWithId('999999999')).rejects.toThrow('NEXT_NOT_FOUND')
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  test('lets a failed request propagate to the error page', async () => {
    fetchQuoteIfExists.mockRejectedValue(new Error('Network down'))

    await expect(renderWithId('7')).rejects.toThrow('Network down')
    expect(mockNotFound).not.toHaveBeenCalled()
  })
})
