import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FavoritesPage, { metadata } from './page'

vi.mock('@/components/favorite-quotes', () => ({
  FavoriteQuotes: () => <div data-testid="favorite-quotes" />,
}))

describe('Favorites page', () => {
  test('has one heading named Favorites', () => {
    render(<FavoritesPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Favorites' }),
    ).toBeVisible()
  })

  test('renders the favorite quotes under the heading', () => {
    render(<FavoritesPage />)

    expect(screen.getByTestId('favorite-quotes')).toBeInTheDocument()
  })

  test('is titled, canonical and kept out of the search index', () => {
    expect(metadata.title).toBe('Favorites')
    expect(metadata.alternates.canonical).toBe('/favorites')
    expect(metadata.robots).toEqual({ index: false })
  })
})
