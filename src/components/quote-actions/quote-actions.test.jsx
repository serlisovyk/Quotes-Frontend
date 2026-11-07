import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQuoteActions } from '@/hooks/use-quote-actions'
import { QuoteActions } from './quote-actions.jsx'

vi.mock('@/hooks/use-quote-actions', () => ({ useQuoteActions: vi.fn() }))

describe('Quote Actions', () => {
  let copyQuote
  let shareQuote

  beforeEach(() => {
    copyQuote = vi.fn()
    shareQuote = vi.fn()

    useQuoteActions.mockReturnValue({ copyQuote, shareQuote })
  })

  test('passes the quote to the hook', () => {
    render(<QuoteActions id={7} text="Be yourself" author="Oscar Wilde" />)

    expect(useQuoteActions).toHaveBeenCalledWith({
      id: 7,
      text: 'Be yourself',
      author: 'Oscar Wilde',
    })
  })

  test('renders named copy and share buttons', () => {
    render(<QuoteActions id={7} text="Be yourself" author="Oscar Wilde" />)

    expect(screen.getByRole('button', { name: 'Copy quote' })).toHaveAttribute(
      'type',
      'button',
    )
    expect(screen.getByRole('button', { name: 'Share quote' })).toHaveAttribute(
      'type',
      'button',
    )
  })

  test('copies the quote when the copy button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuoteActions id={7} text="Be yourself" author="Oscar Wilde" />)

    await user.click(screen.getByRole('button', { name: 'Copy quote' }))

    expect(copyQuote).toHaveBeenCalledTimes(1)
    expect(shareQuote).not.toHaveBeenCalled()
  })

  test('shares the quote when the share button is activated from the keyboard', async () => {
    const user = userEvent.setup()
    render(<QuoteActions id={7} text="Be yourself" author="Oscar Wilde" />)

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('button', { name: 'Share quote' })).toHaveFocus()
    expect(shareQuote).toHaveBeenCalledTimes(1)
  })
})
