import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MenuItems } from './menu-items.jsx'

const mockUsePathname = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('MenuItems Component', () => {
  test('marks the current route as active', () => {
    mockUsePathname.mockReturnValue('/search')

    render(<MenuItems />)

    expect(screen.getByRole('link', { name: /search/i }).ariaCurrent).toBe('page')
  })

  test('does not mark inactive routes as current', () => {
    mockUsePathname.mockReturnValue('/search')

    render(<MenuItems />)

    expect(screen.getByRole('link', { name: /home/i }).ariaCurrent).toBeNull()
  })

  test('has Create New by default', () => {
    mockUsePathname.mockReturnValue('/')

    render(<MenuItems />)

    expect(screen.getByRole('link', { name: 'Create New' })).toBeVisible()
  })

  test('has no Create New in read-only mode', () => {
    mockUsePathname.mockReturnValue('/')

    render(<MenuItems isReadOnly />)

    expect(
      screen.queryByRole('link', { name: 'Create New' }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Home',
      'Random',
      'Search',
      'Favorites',
    ])
  })

  test('has Favorites between Search and Create New', () => {
    mockUsePathname.mockReturnValue('/')

    render(<MenuItems />)

    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Home',
      'Random',
      'Search',
      'Favorites',
      'Create New',
    ])
    expect(screen.getByRole('link', { name: 'Favorites' })).toHaveAttribute(
      'href',
      '/favorites',
    )
  })

  test('marks Favorites as current on its page', () => {
    mockUsePathname.mockReturnValue('/favorites')

    render(<MenuItems />)

    expect(screen.getByRole('link', { name: 'Favorites' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
