import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { INITIAL_SEARCH_VALUES, ROUTES } from '@/constants'
import { SearchForm } from './search-form.jsx'

const mockPush = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('SearchForm Component', () => {
  test('renders limit and offset as numeric backend query controls', () => {
    render(<SearchForm />)

    const limitInput = screen.getByLabelText('Limit')
    const offsetInput = screen.getByLabelText('Offset')

    expect(limitInput.getAttribute('type')).toBe('number')
    expect(limitInput.getAttribute('min')).toBe('1')
    expect(limitInput.getAttribute('max')).toBe('50')
    expect(offsetInput.getAttribute('type')).toBe('number')
    expect(offsetInput.getAttribute('min')).toBe('0')
  })

  test('submits search values as a route query string', () => {
    render(<SearchForm />)

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'courage' },
    })
    fireEvent.change(screen.getByLabelText('Author'), {
      target: { value: 'Churchill' },
    })
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'leadership' },
    })
    fireEvent.change(screen.getByLabelText('Limit'), {
      target: { value: '10' },
    })
    fireEvent.change(screen.getByLabelText('Offset'), {
      target: { value: '20' },
    })

    fireEvent.click(screen.getByRole('button', { name: /^search$/i }))

    expect(mockPush).toHaveBeenCalledWith(
      `${ROUTES.SEARCH}?text=courage&author=Churchill&category=leadership&limit=10&offset=20`,
    )
  })

  test('shows inline validation and prevents navigation for invalid offset', () => {
    render(<SearchForm />)

    fireEvent.change(screen.getByLabelText('Offset'), {
      target: { value: '-1' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^search$/i }))

    expect(
      screen.getByText('Offset must be a positive integer or zero.'),
    ).toBeTruthy()
    expect(mockPush).not.toHaveBeenCalled()
  })

  test('shows the new initial values when the page passes them', () => {
    const { rerender } = render(
      <SearchForm
        initialSearchValues={{ ...INITIAL_SEARCH_VALUES, text: 'life' }}
      />,
    )

    fireEvent.change(screen.getByLabelText('Author'), {
      target: { value: 'typed by the user' },
    })
    rerender(
      <SearchForm
        initialSearchValues={{ ...INITIAL_SEARCH_VALUES, text: 'hope' }}
      />,
    )

    expect(screen.getByLabelText('Text').value).toBe('hope')
    expect(screen.getByLabelText('Author').value).toBe('')
  })

  test('clears the errors when the page passes new initial values', () => {
    const { rerender } = render(
      <SearchForm initialSearchValues={{ ...INITIAL_SEARCH_VALUES }} />,
    )

    fireEvent.change(screen.getByLabelText('Offset'), {
      target: { value: '-1' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^search$/i }))
    expect(
      screen.getByText('Offset must be a positive integer or zero.'),
    ).toBeTruthy()

    rerender(<SearchForm initialSearchValues={{ ...INITIAL_SEARCH_VALUES }} />)

    expect(
      screen.queryByText('Offset must be a positive integer or zero.'),
    ).toBeNull()
  })

  test('keeps what the user typed while the initial values stay the same', () => {
    const initialSearchValues = { ...INITIAL_SEARCH_VALUES }
    const { rerender } = render(
      <SearchForm initialSearchValues={initialSearchValues} />,
    )

    fireEvent.change(screen.getByLabelText('Text'), {
      target: { value: 'courage' },
    })
    rerender(<SearchForm initialSearchValues={initialSearchValues} />)

    expect(screen.getByLabelText('Text').value).toBe('courage')
  })

  test('shows the error of a field as soon as it is typed, after the first submit', () => {
    render(<SearchForm />)

    fireEvent.click(screen.getByRole('button', { name: /^search$/i }))
    fireEvent.change(screen.getByLabelText('Limit'), {
      target: { value: '100' },
    })

    expect(screen.getByText('Limit must be in range 1..50.')).toBeTruthy()
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
