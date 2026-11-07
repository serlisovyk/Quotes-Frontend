import { describe, expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button.jsx'

describe('Button Component', () => {
  const mockOnClick = vi.fn()

  test('renders with primary variant by default', () => {
    render(<Button text="Click Me" onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeTruthy()

    const expectedClass = 'bg-accent'
    expect(button.className).toContain(expectedClass)
  })

  test('renders with secondary variant', () => {
    render(<Button text="Click Me" onClick={mockOnClick} variant="secondary" />)

    const button = screen.getByRole('button', { name: /click me/i })

    const expectedClass = 'bg-secondary'
    expect(button.className).toContain(expectedClass)
  })

  test('renders with danger variant', () => {
    render(<Button text="Delete" onClick={mockOnClick} variant="danger" />)

    const button = screen.getByRole('button', { name: /delete/i })

    const expectedClass = 'bg-danger'
    expect(button.className).toContain(expectedClass)
  })

  test('calls onClick function when clicked', () => {
    render(<Button text="Click Me" onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  test('renders the button itself, with no wrapper around it', () => {
    const { container } = render(<Button text="Click Me" />)

    expect(container.firstElementChild).toBe(screen.getByRole('button'))
  })

  test('renders the link itself, with no wrapper around it', () => {
    const { container } = render(<Button text="Go to Search" href="/search" />)

    expect(container.firstElementChild).toBe(screen.getByRole('link'))
  })

  test('renders a link when href is provided', () => {
    render(<Button text="Go to Search" href="/search" />)

    const link = screen.getByRole('link', { name: /go to search/i })

    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toBe('/search')
    expect(link.className).toContain('bg-accent')
  })

  test('shows a disabled link as inert and out of the tab order', () => {
    render(<Button text="Edit" href="/edit" disabled />)

    const link = screen.getByRole('link', { name: 'Edit' })

    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')
    expect(link).toHaveClass('pointer-events-none')
  })

  test('keeps an enabled link focusable', () => {
    render(<Button text="Edit" href="/edit" />)

    const link = screen.getByRole('link', { name: 'Edit' })

    expect(link).not.toHaveAttribute('aria-disabled')
    expect(link).not.toHaveClass('pointer-events-none')
  })

  test('does not call onClick while disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button text="Save" onClick={onClick} disabled />)

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  test('submits a form when its type is submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <Button text="Send" type="submit" />
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
