import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { deleteQuoteAction } from '@/actions/quote'
import { DeleteQuoteButton } from './delete-quote-button.jsx'

vi.mock('@/actions/quote', () => ({
  deleteQuoteAction: vi.fn(),
}))

describe('Delete Quote Button', () => {
  test('shows an enabled Delete button and no error at first', () => {
    render(<DeleteQuoteButton quoteId={7} />)

    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
    expect(screen.queryByText(/could not/i)).not.toBeInTheDocument()
  })

  test('deletes the quote it is given on submit', async () => {
    const user = userEvent.setup()
    deleteQuoteAction.mockResolvedValue({ error: '' })
    render(<DeleteQuoteButton quoteId={7} />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(deleteQuoteAction).toHaveBeenCalledTimes(1)
    expect(deleteQuoteAction.mock.calls[0][0]).toBe(7)
  })

  test('disables the button and says Deleting... while the action runs', async () => {
    const user = userEvent.setup()
    const { promise, resolve } = Promise.withResolvers()
    deleteQuoteAction.mockReturnValue(promise)
    render(<DeleteQuoteButton quoteId={7} />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled()

    resolve({ error: '' })

    expect(await screen.findByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  test('shows the error the action returns', async () => {
    const user = userEvent.setup()
    deleteQuoteAction.mockResolvedValue({ error: 'Could not delete the quote' })
    render(<DeleteQuoteButton quoteId={7} />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not delete the quote',
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })
})
