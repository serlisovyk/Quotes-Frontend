import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorPage from './error'

const renderErrorPage = (error = new Error('Network down'), reset = vi.fn()) => {
  render(<ErrorPage error={error} reset={reset} />)

  return reset
}

describe('Error page', () => {
  test('tells something went wrong', () => {
    renderErrorPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeTruthy()
  })

  test('does not show the error message to the user', () => {
    renderErrorPage()

    expect(screen.queryByText('Network down')).toBeNull()
  })

  test('tries again through a real button', async () => {
    const user = userEvent.setup()
    const reset = renderErrorPage()

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(reset).toHaveBeenCalledTimes(1)
  })

  test('writes the error to the console', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = Object.assign(new Error('Network down'), { digest: 'abc123' })

    renderErrorPage(error)

    expect(consoleErrorSpy).toHaveBeenCalledWith(error, { digest: 'abc123' })
  })
})
