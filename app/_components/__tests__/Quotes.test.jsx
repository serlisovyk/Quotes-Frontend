import { render } from '@testing-library/react'
import Quotes from '@components/Quotes'

jest.mock('@components/Quote', () => ({ quote }) => (
  <div data-testid="quote">{quote.text}</div>
))

describe('Quotes Component', () => {
  const mockQuotes = [
    {
      id: 1,
      text: 'First test quote',
      author: 'Author 1',
      categories: ['cat1'],
    },
    {
      id: 2,
      text: 'Second test quote',
      author: 'Author 2',
      categories: ['cat2'],
    },
    {
      id: 3,
      text: 'Third test quote',
      author: 'Author 3',
      categories: ['cat3'],
    },
  ]

  test('renders the correct number of Quote components', () => {
    const { getAllByTestId } = render(
      <Quotes quotes={mockQuotes} selectedCategory="" searchText="" />
    )

    expect(getAllByTestId('quote')).toHaveLength(mockQuotes.length)
  })

  test('renders quotes with the correct text', () => {
    const { getByText } = render(
      <Quotes quotes={mockQuotes} selectedCategory="" searchText="" />
    )

    mockQuotes.forEach((quote) => expect(getByText(quote.text)).toBeTruthy())
  })

  test('renders without crashing when no quotes are provided', () => {
    const { container } = render(
      <Quotes quotes={[]} selectedCategory="" searchText="" />
    )

    expect(container).toBeTruthy()
  })
})
