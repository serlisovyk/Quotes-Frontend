import { beforeEach, describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { THEME_STORAGE_KEY, THEMES } from '@/constants'
import { ThemeSwitch } from './theme-switch.jsx'

const getSwitch = (name) => screen.getByRole('button', { name })

describe('Theme Switch', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  test('says the current theme and the next one in its name', () => {
    render(<ThemeSwitch />)

    expect(getSwitch('Theme: System. Switch to Light')).toBeVisible()
  })

  test('starts from the saved theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, THEMES.DARK)

    render(<ThemeSwitch />)

    expect(getSwitch('Theme: Dark. Switch to System')).toBeVisible()
  })

  test('goes light, dark, system and back with each click', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitch />)

    await user.click(getSwitch('Theme: System. Switch to Light'))
    expect(getSwitch('Theme: Light. Switch to Dark')).toBeVisible()

    await user.click(getSwitch('Theme: Light. Switch to Dark'))
    expect(getSwitch('Theme: Dark. Switch to System')).toBeVisible()

    await user.click(getSwitch('Theme: Dark. Switch to System'))
    expect(getSwitch('Theme: System. Switch to Light')).toBeVisible()
  })

  test('saves the choice and applies it to the page', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitch />)

    await user.click(getSwitch('Theme: System. Switch to Light'))
    await user.click(getSwitch('Theme: Light. Switch to Dark'))

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(THEMES.DARK)
    expect(document.documentElement.dataset.theme).toBe(THEMES.DARK)
  })

  test('works from the keyboard', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitch />)

    await user.tab()
    await user.keyboard('{Enter}')

    expect(getSwitch('Theme: Light. Switch to Dark')).toHaveFocus()
  })

  test('hides its icon from assistive technology', () => {
    const { container } = render(<ThemeSwitch />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
