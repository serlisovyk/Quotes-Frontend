import { render } from '@testing-library/react'
import { fetchQuoteByIdOrNull } from '@services/services'
import QuotePage from '../page'

jest.mock('@services/services', () => ({
  fetchQuoteByIdOrNull: jest.fn(),
}))

jest.mock('@components/CategoryTags', () => () => <div />)
jest.mock('@components/DeleteQuoteButton', () => () => <div />)

const renderPage = async (quote) => {
  fetchQuoteByIdOrNull.mockResolvedValue(quote)

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

    expect(getByRole('link', { name: `- ${author}` }).getAttribute('href')).toBe(
      href,
    )
  })
})
