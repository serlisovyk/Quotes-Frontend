import { describe, expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button.jsx'

describe('Button Component', () => {
  const mockOnClick = vi.fn()

  test('renders with primary variant by default', () => {
    render(<Button text="Click Me" onClick={mockOnClick} />)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeTruthy()

    const expectedClass = 'bg-violet-900'
    expect(button.className).toContain(expectedClass)
  })

  test('renders with secondary variant', () => {
    render(<Button text="Click Me" onClick={mockOnClick} variant="secondary" />)

    const button = screen.getByRole('button', { name: /click me/i })

    const expectedClass = 'bg-gray-300'
    expect(button.className).toContain(expectedClass)
  })

  test('renders with danger variant', () => {
    render(<Button text="Delete" onClick={mockOnClick} variant="danger" />)

    const button = screen.getByRole('button', { name: /delete/i })

    const expectedClass = 'bg-red-900'
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
    expect(link.className).toContain('bg-violet-900')
  })
})
