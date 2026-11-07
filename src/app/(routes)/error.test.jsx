import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ErrorPage from './error'

const renderErrorPage = (reset = vi.fn()) => {
  render(<ErrorPage error={new Error('Network down')} reset={reset} />)

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

  test('tries again through a real button', () => {
    const reset = renderErrorPage()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
