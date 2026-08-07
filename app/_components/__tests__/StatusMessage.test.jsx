import { render, screen } from '@testing-library/react'
import StatusMessage from '@components/StatusMessage'

describe('StatusMessage Component', () => {
  test('renders base message styles by default', () => {
    render(<StatusMessage text="Something happened" />)

    const message = screen.getByText(/something happened/i)

    expect(message).toBeTruthy()
    expect(message.className).toContain('text-base')
    expect(message.className).toContain('text-gray-600')
  })

  test('renders large message styles when requested', () => {
    render(<StatusMessage text="Not found" size="large" className="mt-10" />)

    const message = screen.getByText(/not found/i)

    expect(message.className).toContain('text-2xl')
    expect(message.className).toContain('mt-10')
  })
})
