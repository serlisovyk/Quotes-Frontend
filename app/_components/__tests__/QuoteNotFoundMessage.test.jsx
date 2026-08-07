import { render, screen } from '@testing-library/react'
import QuoteNotFoundMessage from '@components/QuoteNotFoundMessage'

describe('QuoteNotFoundMessage Component', () => {
  test('renders the quote not found message with the provided id', () => {
    render(<QuoteNotFoundMessage id="123" />)

    expect(screen.getByText('Quote with id 123 not found.')).toBeTruthy()
  })
})
