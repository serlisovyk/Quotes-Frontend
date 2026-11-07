import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorScreen } from './error-screen.jsx'

describe('Error Screen', () => {
  test('tells something went wrong under the only h1', () => {
    render(<ErrorScreen onRetry={vi.fn()} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeVisible()
  })

  test('asks to try again without showing technical details', () => {
    render(<ErrorScreen onRetry={vi.fn()} />)

    expect(
      screen.getByText('We could not load this page. Please try again.'),
    ).toBeVisible()
  })

  test('calls onRetry from a real Try again button', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(<ErrorScreen onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
