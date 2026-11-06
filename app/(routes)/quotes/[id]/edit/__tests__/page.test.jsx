import { render, screen } from '@testing-library/react'
import { fetchQuoteIfExists } from '@/services/quotes'
import EditQuotePage, { generateMetadata } from '../page'

const mockNotFound = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('@/services/quotes', () => ({
  fetchQuoteIfExists: jest.fn(),
}))

jest.mock('@/actions/quote', () => ({
  updateQuoteAction: jest.fn(),
}))

jest.mock('@/components/quote-form', () => ({
  QuoteForm: ({ buttonText }) => (
    <form aria-label="Quote form">
      <button type="submit">{buttonText}</button>
    </form>
  ),
}))

const renderWithId = (id) => EditQuotePage({ params: Promise.resolve({ id }) })

describe('Edit quote page', () => {
  it('renders the form for an existing quote', async () => {
    fetchQuoteIfExists.mockResolvedValue({
      id: 7,
      text: 'Some text',
      author: 'Author',
      categories: [],
    })

    render(await renderWithId('7'))

    expect(screen.getByRole('form', { name: 'Quote form' })).toBeTruthy()
    expect(fetchQuoteIfExists).toHaveBeenCalledWith('7', { cache: 'no-store' })
  })

  it.each(['abc', '0', '-5', '2147483648'])(
    'calls notFound for the invalid id "%s" without calling the API',
    async (invalidId) => {
      await expect(renderWithId(invalidId)).rejects.toThrow('NEXT_NOT_FOUND')

      expect(fetchQuoteIfExists).not.toHaveBeenCalled()
    },
  )

  it('calls notFound when the quote does not exist', async () => {
    fetchQuoteIfExists.mockResolvedValue(null)

    await expect(renderWithId('999999999')).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('lets a failed request propagate to the error page', async () => {
    fetchQuoteIfExists.mockRejectedValue(new Error('Network down'))

    await expect(renderWithId('7')).rejects.toThrow('Network down')
    expect(mockNotFound).not.toHaveBeenCalled()
  })

  it('is not indexed', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ id: '7' }) })

    expect(metadata.robots.index).toBe(false)
  })
})
