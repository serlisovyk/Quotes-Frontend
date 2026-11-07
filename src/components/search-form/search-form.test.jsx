import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCategorySuggestions } from '@/hooks/use-category-suggestions'
import { INITIAL_SEARCH_VALUES, ROUTES } from '@/constants'
import { SearchForm } from './search-form.jsx'

vi.mock('@/hooks/use-category-suggestions', () => ({
  useCategorySuggestions: vi.fn(() => []),
}))

const mockPush = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('SearchForm Component', () => {
  test('suggests categories for the category field and puts the chosen one into the search', async () => {
    const user = userEvent.setup()
    useCategorySuggestions.mockImplementation((query) =>
      query ? ['leadership', 'learning'] : [],
    )
    render(<SearchForm />)

    await user.type(screen.getByRole('combobox', { name: 'Category' }), 'lea')
    await user.click(screen.getByRole('option', { name: 'learning' }))
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(mockPush).toHaveBeenCalledWith(`${ROUTES.SEARCH}?category=learning`)
  })

  test('does not submit the search when Enter picks a suggestion', async () => {
    const user = userEvent.setup()
    useCategorySuggestions.mockImplementation((query) =>
      query ? ['leadership', 'learning'] : [],
    )
    render(<SearchForm />)

    await user.type(screen.getByRole('combobox', { name: 'Category' }), 'lea')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(screen.getByLabelText('Category')).toHaveValue('leadership')
    expect(mockPush).not.toHaveBeenCalled()
  })

  test('shows a limit from the link that is not in the list as the chosen one', () => {
    render(
      <SearchForm initialSearchValues={{ ...INITIAL_SEARCH_VALUES, limit: '15' }} />,
    )

    expect(screen.getByRole('combobox', { name: 'Limit' })).toHaveValue('15')
    expect(screen.getByRole('option', { name: '15' })).toBeVisible()
  })

  test('has no offset field', () => {
    render(<SearchForm />)

    expect(screen.queryByLabelText('Offset')).not.toBeInTheDocument()
  })

  test('offers the limit as a labelled choice of 10, 20 and 50 shown as 10 by default', () => {
    render(<SearchForm />)

    const limitSelect = screen.getByRole('combobox', { name: 'Limit' })
    const options = screen
      .getAllByRole('option')
      .map(({ textContent }) => textContent)

    expect(limitSelect).toHaveValue('10')
    expect(options).toEqual(['10', '20', '50'])
  })

  test('shows the limit of the URL as the chosen one', () => {
    render(
      <SearchForm initialSearchValues={{ ...INITIAL_SEARCH_VALUES, limit: '20' }} />,
    )

    expect(screen.getByRole('combobox', { name: 'Limit' })).toHaveValue('20')
  })

  test('submits search values as a route query string', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)

    await user.type(screen.getByLabelText('Text'), 'courage')
    await user.type(screen.getByLabelText('Author'), 'Churchill')
    await user.type(screen.getByLabelText('Category'), 'leadership')
    await user.selectOptions(screen.getByLabelText('Limit'), '50')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(mockPush).toHaveBeenCalledWith(
      `${ROUTES.SEARCH}?text=courage&author=Churchill&category=leadership&limit=50`,
    )
  })

  test('sends a category typed with uppercase letters as typed', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)

    await user.type(screen.getByLabelText('Category'), 'Leadership')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(mockPush).toHaveBeenCalledWith(`${ROUTES.SEARCH}?category=Leadership`)
  })

  test('shows inline validation and prevents navigation for an invalid category', async () => {
    const user = userEvent.setup()
    render(<SearchForm />)

    await user.type(screen.getByLabelText('Category'), 'bad category')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(
      screen.getByText('Category can only contain letters, numbers and dashes.'),
    ).toBeVisible()
    expect(mockPush).not.toHaveBeenCalled()
  })

  test('starts a new search on the first page, without the offset of the URL', async () => {
    const user = userEvent.setup()
    render(
      <SearchForm
        initialSearchValues={{
          ...INITIAL_SEARCH_VALUES,
          text: 'life',
          limit: '10',
          offset: '20',
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: /^search$/i }))

    expect(mockPush).toHaveBeenCalledWith(`${ROUTES.SEARCH}?text=life&limit=10`)
  })

  test('shows the new initial values when the page passes them', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <SearchForm
        initialSearchValues={{ ...INITIAL_SEARCH_VALUES, text: 'life' }}
      />,
    )

    await user.type(screen.getByLabelText('Author'), 'typed by the user')
    rerender(
      <SearchForm
        initialSearchValues={{ ...INITIAL_SEARCH_VALUES, text: 'hope' }}
      />,
    )

    expect(screen.getByLabelText('Text')).toHaveValue('hope')
    expect(screen.getByLabelText('Author')).toHaveValue('')
  })

  test('clears the errors when the page passes new initial values', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <SearchForm initialSearchValues={{ ...INITIAL_SEARCH_VALUES }} />,
    )

    await user.type(screen.getByLabelText('Category'), 'bad category')
    await user.click(screen.getByRole('button', { name: /^search$/i }))
    expect(
      screen.getByText('Category can only contain letters, numbers and dashes.'),
    ).toBeVisible()

    rerender(<SearchForm initialSearchValues={{ ...INITIAL_SEARCH_VALUES }} />)

    expect(
      screen.queryByText('Category can only contain letters, numbers and dashes.'),
    ).not.toBeInTheDocument()
  })

  test('keeps what the user typed while the initial values stay the same', async () => {
    const user = userEvent.setup()
    const initialSearchValues = { ...INITIAL_SEARCH_VALUES }
    const { rerender } = render(
      <SearchForm initialSearchValues={initialSearchValues} />,
    )

    await user.type(screen.getByLabelText('Text'), 'courage')
    rerender(<SearchForm initialSearchValues={initialSearchValues} />)

    expect(screen.getByLabelText('Text')).toHaveValue('courage')
  })

  test('clears search values and returns to the search route', async () => {
    const user = userEvent.setup()
    render(
      <SearchForm
        initialSearchValues={{
          text: 'life',
          author: '',
          category: '',
          limit: '20',
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: /^clear$/i }))

    expect(mockPush).toHaveBeenCalledWith(ROUTES.SEARCH)
  })
})
