import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './header.jsx'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

const getMenuToggle = () =>
  screen.getByRole('button', { name: 'Open navigation menu' })

describe('Header', () => {
  test('shows the app name as a link home', () => {
    render(<Header />)

    expect(screen.getByRole('link', { name: /quotes app/i })).toHaveAttribute(
      'href',
      '/',
    )
  })

  test('has the theme switch', () => {
    render(<Header />)

    expect(screen.getByRole('button', { name: /^Theme:/ })).toBeVisible()
  })

  test('keeps the mobile menu closed at first', () => {
    render(<Header />)

    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('button', { name: 'Close mobile navigation' }),
    ).not.toBeInTheDocument()
  })

  test('opens the mobile menu with its links', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const linksBefore = screen.getAllByRole('link', { name: 'Random' }).length

    await user.click(getMenuToggle())

    expect(
      screen.getAllByRole('button', { name: 'Close navigation menu' })[0],
    ).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('link', { name: 'Random' })).toHaveLength(
      linksBefore + 1,
    )
  })

  test('closes the mobile menu with the burger button', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(getMenuToggle())

    await user.click(
      screen.getAllByRole('button', { name: 'Close navigation menu' })[0],
    )

    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'false')
  })

  test('closes the mobile menu with the overlay', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(getMenuToggle())

    await user.click(screen.getByRole('button', { name: 'Close mobile navigation' }))

    expect(getMenuToggle()).toBeInTheDocument()
  })

  test('closes the mobile menu when the logo link is followed', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(getMenuToggle())

    await user.click(screen.getByRole('link', { name: /quotes app/i }))

    expect(getMenuToggle()).toBeInTheDocument()
  })

  test('closes the mobile menu after a link is followed', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(getMenuToggle())
    const [mobileSearchLink] = screen.getAllByRole('link', { name: 'Search' })

    await user.click(mobileSearchLink)

    expect(getMenuToggle()).toBeInTheDocument()
  })
})
