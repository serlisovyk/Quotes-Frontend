import { render } from '@testing-library/react'
import Quote from '@components/Quote'

jest.mock('@components/CategoryTags', () => () => (
  <div data-testid="category-tags" />
))

describe('Quote Component', () => {
  const mockQuote = {
    id: 1,
    text: 'This is a test quote text which is greater than 200 characters. This is really very long text which is displayed on the quuotes page in the quotes application which helps to work with different quotes!',
    author: 'Test Author',
    categories: ['category1', 'category2'],
  }

  test('renders the quote text and author', () => {
    const { getByText } = render(
      <Quote quote={mockQuote} selectedCategory="category1" searchText="" />
    )

    expect(getByText(/This is a test quote text which/)).toBeTruthy()
    expect(getByText(/Test Author/)).toBeTruthy()
  })

  test('truncates the quote text if it is too long', () => {
    const { getByText } = render(
      <Quote quote={mockQuote} selectedCategory="category1" searchText="" />
    )

    expect(
      getByText(
        /This is a test quote text which is greater than 200 characters. This is really very long text which is displayed on the quuotes page in the quotes application which helps to work with different quotes\.\.\./
      )
    ).toBeTruthy()
  })

  test('renders the CategoryTags component', () => {
    const { getByTestId } = render(
      <Quote quote={mockQuote} selectedCategory="category1" searchText="" />
    )

    expect(getByTestId('category-tags')).toBeTruthy()
  })

  test('highlights the search text in the quote', () => {
    const searchText = 'test quote text'
    const { getByText } = render(
      <Quote
        quote={mockQuote}
        selectedCategory="category1"
        searchText={searchText}
      />
    )

    const highlightedText = getByText(/test quote text/i)
    expect(highlightedText).toBeTruthy()
    expect(highlightedText.tagName).toBe('SPAN')

    expect(highlightedText.className).toContain('bg-yellow-300')

    expect(getByText(/This is a /)).toBeTruthy()
    expect(
      getByText(/This is really very long text which is displayed/)
    ).toBeTruthy()
  })
})
