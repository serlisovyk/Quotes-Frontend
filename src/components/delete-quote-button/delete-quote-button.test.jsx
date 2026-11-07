import { describe, expect, test, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { deleteQuoteAction } from '@/actions/quote'
import { DeleteQuoteButton } from './delete-quote-button.jsx'

vi.mock('@/actions/quote', () => ({
  deleteQuoteAction: vi.fn(),
}))

const openDialog = async (user) => {
  await user.click(screen.getByRole('button', { name: 'Delete' }))

  return screen.getByRole('dialog')
}

describe('Delete Quote Button', () => {
  test('shows an enabled Delete button, a closed dialog and no error at first', () => {
    render(<DeleteQuoteButton quoteId={7} />)

    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('opens a confirmation dialog without deleting', async () => {
    const user = userEvent.setup()
    render(<DeleteQuoteButton quoteId={7} />)

    const dialog = await openDialog(user)

    expect(dialog).toHaveAccessibleName('Delete this quote?')
    expect(dialog).toHaveTextContent(/cannot be undone/i)
    expect(deleteQuoteAction).not.toHaveBeenCalled()
  })

  test('gives the initial focus to Cancel', async () => {
    const user = userEvent.setup()
    render(<DeleteQuoteButton quoteId={7} />)

    const dialog = await openDialog(user)

    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  test('closes on Cancel, deletes nothing and returns focus to Delete', async () => {
    const user = userEvent.setup()
    render(<DeleteQuoteButton quoteId={7} />)
    const trigger = screen.getByRole('button', { name: 'Delete' })

    const dialog = await openDialog(user)
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(deleteQuoteAction).not.toHaveBeenCalled()
  })

  test('closes on Escape and deletes nothing', async () => {
    const user = userEvent.setup()
    render(<DeleteQuoteButton quoteId={7} />)

    await openDialog(user)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus()
    expect(deleteQuoteAction).not.toHaveBeenCalled()
  })

  test('closes on a click on the backdrop but not on the dialog content', async () => {
    const user = userEvent.setup()
    render(<DeleteQuoteButton quoteId={7} />)

    const dialog = await openDialog(user)
    await user.click(within(dialog).getByRole('heading'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(dialog)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(deleteQuoteAction).not.toHaveBeenCalled()
  })

  test('deletes the quote it is given when Delete is confirmed', async () => {
    const user = userEvent.setup()
    deleteQuoteAction.mockResolvedValue({ error: '' })
    render(<DeleteQuoteButton quoteId={7} />)

    const dialog = await openDialog(user)
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(deleteQuoteAction).toHaveBeenCalledTimes(1)
    expect(deleteQuoteAction.mock.calls[0][0]).toBe(7)
  })

  test('disables the buttons and says Deleting... while the action runs', async () => {
    const user = userEvent.setup()
    const { promise, resolve } = Promise.withResolvers()
    deleteQuoteAction.mockReturnValue(promise)
    render(<DeleteQuoteButton quoteId={7} />)

    const dialog = await openDialog(user)
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(
      within(dialog).getByRole('button', { name: 'Deleting...' }),
    ).toBeDisabled()
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled()

    resolve({ error: '' })

    expect(
      await within(dialog).findByRole('button', { name: 'Delete' }),
    ).toBeEnabled()
  })

  test('keeps the dialog open and shows the error the action returns', async () => {
    const user = userEvent.setup()
    deleteQuoteAction.mockResolvedValue({ error: 'Could not delete the quote' })
    render(<DeleteQuoteButton quoteId={7} />)

    const dialog = await openDialog(user)
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'Could not delete the quote',
    )
    expect(dialog).toBeVisible()
    expect(within(dialog).getByRole('button', { name: 'Delete' })).toBeEnabled()
  })
})
