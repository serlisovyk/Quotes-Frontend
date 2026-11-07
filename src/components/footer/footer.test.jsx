import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './footer.jsx'

describe('Footer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2031-05-20T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('shows the current year and the author', () => {
    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      '2031 © Serhii Lisovyk',
    )
  })
})
