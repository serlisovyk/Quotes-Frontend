import { fireEvent, render, screen } from '@testing-library/react'
import { SearchForm } from './search-form.jsx'
import { ROUTES } from '@/constants'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('SearchForm Component', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  test('renders limit and offset as numeric backend query controls', () => {
    render(<SearchForm />)

    const limitInput = screen.getByPlaceholderText(/limit/i)
    const offsetInput = screen.getByPlaceholderText(/offset/i)

    expect(limitInput.getAttribute('type')).toBe('number')
    expect(limitInput.getAttribute('min')).toBe('1')
    expect(limitInput.getAttribute('max')).toBe('50')
    expect(offsetInput.getAttribute('type')).toBe('number')
    expect(offsetInput.getAttribute('min')).toBe('0')
  })

  test('submits search values as a route query string', () => {
    render(<SearchForm />)

    fireEvent.change(screen.getByPlaceholderText(/search by text/i), {
      target: { value: 'courage' },
    })
    fireEvent.change(screen.getByPlaceholderText(/search by author/i), {
      target: { value: 'Churchill' },
    })
    fireEvent.change(screen.getByPlaceholderText(/search by category/i), {
      target: { value: 'leadership' },
    })
    fireEvent.change(screen.getByPlaceholderText(/limit/i), {
      target: { value: '10' },
    })
    fireEvent.change(screen.getByPlaceholderText(/offset/i), {
      target: { value: '20' },
    })

    fireEvent.click(screen.getByRole('button', { name: /^search$/i }))

    expect(mockPush).toHaveBeenCalledWith(
      `${ROUTES.SEARCH}?text=courage&author=Churchill&category=leadership&limit=10&offset=20`,
    )
  })

  test('shows inline validation and prevents navigation for invalid offset', () => {
    render(<SearchForm />)

    fireEvent.change(screen.getByPlaceholderText(/offset/i), {
      target: { value: '-1' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^search$/i }))

    expect(
      screen.getByText('Offset must be a positive integer or zero.'),
    ).toBeTruthy()
    expect(mockPush).not.toHaveBeenCalled()
  })

  test('clears search values and returns to the search route', () => {
    render(
      <SearchForm
        initialSearchValues={{
          text: 'life',
          author: '',
          category: '',
          limit: '10',
          offset: '20',
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /^clear$/i }))

    expect(mockPush).toHaveBeenCalledWith(ROUTES.SEARCH)
  })
})
