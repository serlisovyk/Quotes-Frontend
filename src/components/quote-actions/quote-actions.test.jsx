import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFavoriteQuote } from '@/hooks/use-favorite-quote'
import { useQuoteActions } from '@/hooks/use-quote-actions'
import { QuoteActions } from './quote-actions.jsx'

vi.mock('@/hooks/use-quote-actions', () => ({ useQuoteActions: vi.fn() }))
vi.mock('@/hooks/use-favorite-quote', () => ({ useFavoriteQuote: vi.fn() }))

const quote = {
  id: 7,
  text: 'Be yourself',
  author: 'Oscar Wilde',
  categories: ['life'],
}

const renderActions = () => render(<QuoteActions {...quote} />)

describe('Quote Actions', () => {
  let copyQuote
  let shareQuote
  let toggleFavorite

  beforeEach(() => {
    copyQuote = vi.fn()
    shareQuote = vi.fn()
    toggleFavorite = vi.fn()

    useQuoteActions.mockReturnValue({ copyQuote, shareQuote })
    useFavoriteQuote.mockReturnValue({ isFavorite: false, toggleFavorite })
  })

  test('passes the quote to the hooks', () => {
    renderActions()

    expect(useQuoteActions).toHaveBeenCalledWith(quote)
    expect(useFavoriteQuote).toHaveBeenCalledWith(quote)
  })

  test('renders named copy and share buttons', () => {
    renderActions()

    expect(screen.getByRole('button', { name: 'Copy quote' })).toHaveAttribute(
      'type',
      'button',
    )
    expect(screen.getByRole('button', { name: 'Share quote' })).toHaveAttribute(
      'type',
      'button',
    )
  })

  test('copy and share are not toggles', () => {
    renderActions()

    expect(screen.getByRole('button', { name: 'Copy quote' })).not.toHaveAttribute(
      'aria-pressed',
    )
    expect(screen.getByRole('button', { name: 'Share quote' })).not.toHaveAttribute(
      'aria-pressed',
    )
  })

  test('copies the quote when the copy button is clicked', async () => {
    const user = userEvent.setup()
    renderActions()

    await user.click(screen.getByRole('button', { name: 'Copy quote' }))

    expect(copyQuote).toHaveBeenCalledTimes(1)
    expect(shareQuote).not.toHaveBeenCalled()
    expect(toggleFavorite).not.toHaveBeenCalled()
  })

  test('shares the quote when the share button is activated from the keyboard', async () => {
    const user = userEvent.setup()
    renderActions()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('button', { name: 'Share quote' })).toHaveFocus()
    expect(shareQuote).toHaveBeenCalledTimes(1)
  })

  test('offers to add a quote that is not a favorite, as a button that is not pressed', () => {
    renderActions()

    expect(screen.getByRole('button', { name: 'Add to favorites' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(
      screen.queryByRole('button', { name: 'Remove from favorites' }),
    ).not.toBeInTheDocument()
  })

  test('offers to remove a favorite quote, as a pressed button', () => {
    useFavoriteQuote.mockReturnValue({ isFavorite: true, toggleFavorite })

    renderActions()

    expect(
      screen.getByRole('button', { name: 'Remove from favorites' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.queryByRole('button', { name: 'Add to favorites' }),
    ).not.toBeInTheDocument()
  })

  test('toggles the favorite when the star is clicked', async () => {
    const user = userEvent.setup()
    renderActions()

    await user.click(screen.getByRole('button', { name: 'Add to favorites' }))

    expect(toggleFavorite).toHaveBeenCalledTimes(1)
    expect(copyQuote).not.toHaveBeenCalled()
  })

  test('toggles the favorite when the star is activated from the keyboard', async () => {
    const user = userEvent.setup()
    renderActions()

    await user.tab()
    await user.tab()
    await user.tab()
    await user.keyboard(' ')

    expect(screen.getByRole('button', { name: 'Add to favorites' })).toHaveFocus()
    expect(toggleFavorite).toHaveBeenCalledTimes(1)
  })

  test('keeps the same star button when the favorite changes, so the focus stays', () => {
    const { rerender } = renderActions()
    const star = screen.getByRole('button', { name: 'Add to favorites' })

    useFavoriteQuote.mockReturnValue({ isFavorite: true, toggleFavorite })
    rerender(<QuoteActions {...quote} />)

    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBe(star)
  })
})
