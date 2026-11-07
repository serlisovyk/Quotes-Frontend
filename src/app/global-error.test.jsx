import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { THEME_STORAGE_KEY, THEMES } from '@/constants'
import GlobalError from './global-error'

const renderGlobalError = (error = new Error('Layout failed'), reset = vi.fn()) => {
  render(<GlobalError error={error} reset={reset} />, { container: document })

  return reset
}

describe('Global Error', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  test('renders a whole document of its own', () => {
    const markup = renderToString(
      <GlobalError error={new Error('Layout failed')} reset={vi.fn()} />,
    )

    expect(markup).toMatch(/^<html lang="en"/)
    expect(markup).toContain('<body')
    expect(markup).toContain('<title>Something went wrong</title>')
  })

  test.each([THEMES.DARK, THEMES.LIGHT])(
    'applies the saved %s theme to the document',
    (savedTheme) => {
      localStorage.setItem(THEME_STORAGE_KEY, savedTheme)

      renderGlobalError()

      expect(document.documentElement).toHaveAttribute('data-theme', savedTheme)
    },
  )

  test('follows the system scheme when nothing is saved', () => {
    renderGlobalError()

    expect(document.documentElement).toHaveAttribute('data-theme', THEMES.LIGHT)
  })

  test('tells something went wrong under the only h1', () => {
    renderGlobalError()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeVisible()
  })

  test('does not show the error message to the user', () => {
    renderGlobalError()

    expect(screen.queryByText('Layout failed')).toBeNull()
  })

  test('tries again through a real button', async () => {
    const user = userEvent.setup()
    const reset = renderGlobalError()

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(reset).toHaveBeenCalledTimes(1)
  })

  test('writes the error to the console', () => {
    const error = Object.assign(new Error('Layout failed'), { digest: 'abc123' })

    renderGlobalError(error)

    expect(console.error).toHaveBeenCalledWith(error, { digest: 'abc123' })
  })
})
