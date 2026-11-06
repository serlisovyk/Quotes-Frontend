import { render, screen } from '@testing-library/react'
import { MenuItems } from './menu-items.jsx'

const mockUsePathname = jest.fn()

jest.mock('next/navigation', () => ({
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
})
