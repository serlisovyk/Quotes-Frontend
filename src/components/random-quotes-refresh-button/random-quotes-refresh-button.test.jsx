import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RandomQuotesRefreshButton } from './random-quotes-refresh-button.jsx'

const mockRefresh = vi.hoisted(() => vi.fn())
const mockTransition = vi.hoisted(() => ({ isPending: false }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}))

vi.mock('react', async () => {
  const actual = await vi.importActual('react')

  return {
    ...actual,
    useTransition: () => [mockTransition.isPending, (callback) => callback()],
  }
})

vi.mock('@/components/quotes', () => ({
  Quotes: ({ quotes }) => <ul aria-label="Quotes">{quotes.length}</ul>,
}))

vi.mock('@/components/loader', () => ({
  Loader: () => <div data-testid="loader" />,
}))

const quotes = [{ id: 1, text: 'Stay sharp', author: 'Someone', categories: [] }]

const renderButton = (props = {}) =>
  render(<RandomQuotesRefreshButton quotes={quotes} hasError={false} {...props} />)

describe('Random Quotes Refresh Button', () => {
  test('shows the quotes it is given', () => {
    mockTransition.isPending = false
    renderButton()

    expect(screen.getByLabelText('Quotes')).toHaveTextContent('1')
    expect(screen.getByRole('button', { name: 'Get Random Quotes' })).toBeEnabled()
  })

  test('shows the error message instead of the quotes on failure', () => {
    mockTransition.isPending = false
    renderButton({ quotes: [], hasError: true })

    expect(screen.getByText('Error while fetching random quotes')).toBeVisible()
    expect(screen.queryByLabelText('Quotes')).not.toBeInTheDocument()
  })

  test('refreshes the route on click', async () => {
    mockTransition.isPending = false
    const user = userEvent.setup()
    renderButton()

    await user.click(screen.getByRole('button', { name: 'Get Random Quotes' }))

    expect(mockRefresh).toHaveBeenCalledTimes(1)
  })

  test('keeps the quotes and shows the loader while refreshing', () => {
    mockTransition.isPending = true
    const { container } = renderButton()

    expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled()
    expect(screen.getByLabelText('Quotes')).toBeVisible()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
  })

  test('keeps the error message while refreshing', () => {
    mockTransition.isPending = true
    renderButton({ quotes: [], hasError: true })

    expect(screen.getByText('Error while fetching random quotes')).toBeVisible()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  test('shows no loader and is not busy when idle', () => {
    mockTransition.isPending = false
    const { container } = renderButton()

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    expect(container.querySelector('[aria-busy="true"]')).not.toBeInTheDocument()
  })
})
