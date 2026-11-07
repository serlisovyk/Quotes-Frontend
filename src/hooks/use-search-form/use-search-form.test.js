import { describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { INITIAL_SEARCH_VALUES, ROUTES } from '@/constants'
import { useSearchForm } from './use-search-form.js'

const mockPush = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const createEvent = () => ({ preventDefault: vi.fn() })

const renderSearchForm = (initialSearchValues = { ...INITIAL_SEARCH_VALUES }) =>
  renderHook(({ values }) => useSearchForm(values), {
    initialProps: { values: initialSearchValues },
  })

describe('useSearchForm', () => {
  test('starts with the initial values, no errors and errors hidden', () => {
    const initialSearchValues = { ...INITIAL_SEARCH_VALUES, text: 'life' }
    const { result } = renderSearchForm(initialSearchValues)

    expect(result.current.searchValues).toEqual(initialSearchValues)
    expect(result.current.validationErrors).toEqual({})
    expect(result.current.showError).toBe(false)
  })

  test('handleInputChange stores the value and the error of that field', () => {
    const { result } = renderSearchForm()

    act(() => result.current.handleInputChange('limit', '100'))

    expect(result.current.searchValues.limit).toBe('100')
    expect(result.current.validationErrors).toEqual({
      limit: 'Limit must be in range 1..50.',
    })
  })

  test('handleInputChange drops the error once the value is valid', () => {
    const { result } = renderSearchForm()

    act(() => result.current.handleInputChange('limit', '100'))
    act(() => result.current.handleInputChange('limit', '10'))

    expect(result.current.validationErrors).toEqual({})
  })

  test('handleSubmit shows the errors and does not navigate when a field is invalid', () => {
    const { result } = renderSearchForm()
    const event = createEvent()

    act(() => result.current.handleInputChange('limit', '100'))
    act(() => result.current.handleSubmit(event))

    expect(event.preventDefault).toHaveBeenCalledTimes(1)
    expect(result.current.showError).toBe(true)
    expect(result.current.validationErrors.limit).toBe(
      'Limit must be in range 1..50.',
    )
    expect(mockPush).not.toHaveBeenCalled()
  })

  test('handleSubmit navigates to the search route with the query', () => {
    const { result } = renderSearchForm()

    act(() => result.current.handleInputChange('text', 'courage'))
    act(() => result.current.handleSubmit(createEvent()))

    expect(mockPush).toHaveBeenCalledWith(`${ROUTES.SEARCH}?text=courage`)
  })

  test('handleSubmit leaves the offset of the URL out of the new search', () => {
    const { result } = renderSearchForm({
      ...INITIAL_SEARCH_VALUES,
      text: 'life',
      limit: '20',
      offset: '40',
    })

    act(() => result.current.handleSubmit(createEvent()))

    expect(mockPush).toHaveBeenCalledWith(`${ROUTES.SEARCH}?text=life&limit=20`)
  })

  test('handleSubmit navigates to the bare search route when nothing is filled', () => {
    const { result } = renderSearchForm()

    act(() => result.current.handleSubmit(createEvent()))

    expect(mockPush).toHaveBeenCalledWith(ROUTES.SEARCH)
  })

  test('handleClear empties the values and errors and goes to the search route', () => {
    const { result } = renderSearchForm({ ...INITIAL_SEARCH_VALUES, text: 'life' })

    act(() => result.current.handleInputChange('limit', '100'))
    act(() => result.current.handleClear())

    expect(result.current.searchValues).toEqual(INITIAL_SEARCH_VALUES)
    expect(result.current.validationErrors).toEqual({})
    expect(result.current.showError).toBe(false)
    expect(mockPush).toHaveBeenCalledWith(ROUTES.SEARCH)
  })

  test('takes the new initial values and clears the errors when they change', () => {
    const { result, rerender } = renderSearchForm()

    act(() => result.current.handleInputChange('limit', '100'))
    act(() => result.current.handleSubmit(createEvent()))
    rerender({ values: { ...INITIAL_SEARCH_VALUES, text: 'hope' } })

    expect(result.current.searchValues.text).toBe('hope')
    expect(result.current.validationErrors).toEqual({})
    expect(result.current.showError).toBe(false)
  })

  test('keeps what was typed while the initial values stay the same', () => {
    const initialSearchValues = { ...INITIAL_SEARCH_VALUES }
    const { result, rerender } = renderSearchForm(initialSearchValues)

    act(() => result.current.handleInputChange('text', 'courage'))
    rerender({ values: initialSearchValues })

    expect(result.current.searchValues.text).toBe('courage')
  })
})
