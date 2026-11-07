import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useFavorites } from '@/hooks/use-favorites'
import { FavoriteQuotes } from './favorite-quotes.jsx'

vi.mock('@/hooks/use-favorites', () => ({ useFavorites: vi.fn() }))

vi.mock('@/components/quotes', () => ({
  Quotes: ({ quotes }) => (
    <ul>
      {quotes.map(({ id, text }) => (
        <li key={id}>{text}</li>
      ))}
    </ul>
  ),
}))

const favorites = [
  { id: 2, text: 'Stay hungry', author: 'Steve Jobs', categories: [] },
  { id: 1, text: 'Be yourself', author: 'Oscar Wilde', categories: ['life'] },
]

describe('Favorite Quotes', () => {
  beforeEach(() => {
    useFavorites.mockReturnValue({ favorites, isReady: true })
  })

  test('shows the saved quotes in their order', () => {
    render(<FavoriteQuotes />)

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Stay hungry',
      'Be yourself',
    ])
  })

  test('does not show the empty state when there are quotes', () => {
    render(<FavoriteQuotes />)

    expect(screen.queryByText('No favorite quotes yet.')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Search quotes' }),
    ).not.toBeInTheDocument()
  })

  test('shows the empty state with a link to search when nothing is saved', () => {
    useFavorites.mockReturnValue({ favorites: [], isReady: true })

    render(<FavoriteQuotes />)

    expect(screen.getByText('No favorite quotes yet.')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Search quotes' })).toHaveAttribute(
      'href',
      '/search',
    )
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  test('shows nothing until the storage has been read', () => {
    useFavorites.mockReturnValue({ favorites: [], isReady: false })

    const { container } = render(<FavoriteQuotes />)

    expect(container).toBeEmptyDOMElement()
  })
})
