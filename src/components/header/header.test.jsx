import { describe, expect, test, vi } from 'vitest'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './header.jsx'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

const getMenuToggle = () =>
  screen.getByRole('button', { name: 'Open navigation menu' })

const getMobileMenu = () => screen.getByRole('dialog', { name: 'Mobile navigation' })

const queryMobileMenu = () =>
  screen.queryByRole('dialog', { name: 'Mobile navigation' })

const openMobileMenu = async (user) => {
  await user.click(getMenuToggle())

  return getMobileMenu()
}

describe('Header', () => {
  test('shows the app name as a link home', () => {
    render(<Header />)

    expect(screen.getByRole('link', { name: /quotes app/i })).toHaveAttribute(
      'href',
      '/',
    )
  })

  test('does not make the logo a heading', () => {
    render(<Header />)

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  test('has the theme switch', () => {
    render(<Header />)

    expect(screen.getByRole('button', { name: /^Theme:/ })).toBeVisible()
  })

  test('keeps the mobile menu closed at first', () => {
    render(<Header />)

    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(queryMobileMenu()).not.toBeInTheDocument()
  })

  test('links the burger button to the menu it controls', () => {
    render(<Header />)

    const menuId = getMenuToggle().getAttribute('aria-controls')

    expect(document.getElementById(menuId)).toBe(
      screen.getByRole('dialog', { hidden: true }),
    )
  })

  test('opens the mobile menu as a dialog with its links', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const menu = await openMobileMenu(user)

    expect(menu).toBeVisible()
    expect(within(menu).getByRole('link', { name: 'Random' })).toBeVisible()
    expect(
      screen.getAllByRole('button', { name: 'Close navigation menu' })[0],
    ).toHaveAttribute('aria-expanded', 'true')
  })

  test('moves the focus into the menu when it opens', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const menu = await openMobileMenu(user)

    expect(menu).toContainElement(document.activeElement)
  })

  test('closes the menu on Escape and puts the focus back on the burger button', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await openMobileMenu(user)

    await user.keyboard('{Escape}')

    expect(queryMobileMenu()).not.toBeInTheDocument()
    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(getMenuToggle()).toHaveFocus()
  })

  test('closes the menu with its own close button and returns the focus', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const menu = await openMobileMenu(user)

    await user.click(
      within(menu).getByRole('button', { name: 'Close navigation menu' }),
    )

    expect(queryMobileMenu()).not.toBeInTheDocument()
    expect(getMenuToggle()).toHaveFocus()
  })

  test('closes the menu with a click on the backdrop', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const menu = await openMobileMenu(user)

    await user.click(menu)

    expect(queryMobileMenu()).not.toBeInTheDocument()
    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'false')
  })

  test('closes the menu after a link is followed', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const menu = await openMobileMenu(user)

    await user.click(within(menu).getByRole('link', { name: 'Search' }))

    expect(queryMobileMenu()).not.toBeInTheDocument()
    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'false')
  })

  test('closes the open menu when the window grows to the desktop width', async () => {
    const user = userEvent.setup()
    const listeners = []
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: (type, listener) => listeners.push(listener),
      removeEventListener: () => {},
    }))
    render(<Header />)
    await openMobileMenu(user)

    act(() => listeners.forEach((listener) => listener({ matches: false })))

    expect(getMobileMenu()).toBeVisible()

    act(() => listeners.forEach((listener) => listener({ matches: true })))

    expect(queryMobileMenu()).not.toBeInTheDocument()
  })

  test('has Create New in both menus by default', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const menu = await openMobileMenu(user)

    expect(screen.getAllByRole('link', { name: 'Create New' })).toHaveLength(2)
    expect(within(menu).getByRole('link', { name: 'Create New' })).toBeVisible()
  })

  test('has no Create New in either menu in read-only mode', async () => {
    const user = userEvent.setup()
    render(<Header isReadOnly />)

    const menu = await openMobileMenu(user)

    expect(
      screen.queryByRole('link', { name: 'Create New' }),
    ).not.toBeInTheDocument()
    expect(within(menu).getByRole('link', { name: 'Search' })).toBeVisible()
  })
})
