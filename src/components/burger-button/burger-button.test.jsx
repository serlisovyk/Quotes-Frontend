import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BurgerButton } from './burger-button.jsx'

describe('Burger Button', () => {
  test('offers to open the menu while it is closed', () => {
    render(<BurgerButton isOpen={false} toggleMenu={vi.fn()} controls="menu" />)

    const button = screen.getByRole('button', { name: 'Open navigation menu' })

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'menu')
  })

  test('offers to close the menu while it is open', () => {
    render(<BurgerButton isOpen toggleMenu={vi.fn()} controls="menu" />)

    expect(
      screen.getByRole('button', { name: 'Close navigation menu' }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  test('toggles the menu on click', async () => {
    const user = userEvent.setup()
    const toggleMenu = vi.fn()
    render(<BurgerButton isOpen={false} toggleMenu={toggleMenu} controls="menu" />)

    await user.click(screen.getByRole('button'))

    expect(toggleMenu).toHaveBeenCalledTimes(1)
  })
})
