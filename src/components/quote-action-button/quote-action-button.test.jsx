import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QUOTE_ACTION_ICONS } from '@/constants'
import { QuoteActionButton } from './quote-action-button.jsx'

describe('Quote Action Button', () => {
  test('is a named button that does not submit a form', () => {
    render(
      <QuoteActionButton
        label="Copy quote"
        icon={QUOTE_ACTION_ICONS.COPY}
        onClick={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Copy quote' })).toHaveAttribute(
      'type',
      'button',
    )
  })

  test('is not a toggle without isPressed', () => {
    render(
      <QuoteActionButton
        label="Copy quote"
        icon={QUOTE_ACTION_ICONS.COPY}
        onClick={vi.fn()}
      />,
    )

    expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed')
  })

  test.each([
    [true, 'true'],
    [false, 'false'],
  ])('exposes isPressed %s as aria-pressed', (isPressed, expected) => {
    render(
      <QuoteActionButton
        label="Add to favorites"
        icon={QUOTE_ACTION_ICONS.FAVORITE}
        isPressed={isPressed}
        onClick={vi.fn()}
      />,
    )

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', expected)
  })

  test('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <QuoteActionButton
        label="Copy quote"
        icon={QUOTE_ACTION_ICONS.COPY}
        onClick={onClick}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Copy quote' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('draws the favorite star icon', () => {
    const { container } = render(
      <QuoteActionButton
        label="Add to favorites"
        icon={QUOTE_ACTION_ICONS.FAVORITE}
        isPressed={false}
        onClick={vi.fn()}
      />,
    )

    expect(container.querySelectorAll('svg path')).toHaveLength(1)
  })
})
