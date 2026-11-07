import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { fetchCategorySuggestions } from '@/services/category-suggestions'
import { CATEGORY_SUGGESTIONS_DEBOUNCE_MS } from '@/constants'
import { useCategorySuggestions } from './use-category-suggestions.js'

vi.mock('@/services/category-suggestions', () => ({
  fetchCategorySuggestions: vi.fn(),
}))

const advance = (milliseconds) =>
  act(() => vi.advanceTimersByTimeAsync(milliseconds))

const createDeferred = () => {
  const deferred = {}

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })

  return deferred
}

describe('useCategorySuggestions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('has no suggestions and requests nothing for an empty query', async () => {
    const { result } = renderHook(() => useCategorySuggestions(''))

    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS * 2)

    expect(result.current).toEqual([])
    expect(fetchCategorySuggestions).not.toHaveBeenCalled()
  })

  test('requests the suggestions only after the debounce delay', async () => {
    fetchCategorySuggestions.mockResolvedValue(['leadership'])
    renderHook(() => useCategorySuggestions('lea'))

    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS - 1)
    expect(fetchCategorySuggestions).not.toHaveBeenCalled()

    await advance(1)
    expect(fetchCategorySuggestions).toHaveBeenCalledWith(
      'lea',
      expect.any(AbortSignal),
    )
  })

  test('returns the suggested names', async () => {
    fetchCategorySuggestions.mockResolvedValue(['leadership', 'learning'])
    const { result } = renderHook(() => useCategorySuggestions('lea'))

    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS)

    expect(result.current).toEqual(['leadership', 'learning'])
  })

  test('requests only the last query when the user keeps typing', async () => {
    fetchCategorySuggestions.mockResolvedValue([])
    const { rerender } = renderHook(({ query }) => useCategorySuggestions(query), {
      initialProps: { query: 'l' },
    })

    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS - 50)
    rerender({ query: 'le' })
    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS - 50)
    rerender({ query: 'lea' })
    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS)

    expect(fetchCategorySuggestions).toHaveBeenCalledTimes(1)
    expect(fetchCategorySuggestions).toHaveBeenCalledWith(
      'lea',
      expect.any(AbortSignal),
    )
  })

  test('cancels the request in flight when the query changes', async () => {
    const first = createDeferred()
    fetchCategorySuggestions.mockReturnValueOnce(first.promise)
    const { rerender } = renderHook(({ query }) => useCategorySuggestions(query), {
      initialProps: { query: 'le' },
    })

    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS)
    const [, firstSignal] = fetchCategorySuggestions.mock.calls[0]
    expect(firstSignal.aborted).toBe(false)

    rerender({ query: 'lea' })

    expect(firstSignal.aborted).toBe(true)
  })

  test('ignores a stale response that arrives after a newer query', async () => {
    const first = createDeferred()
    fetchCategorySuggestions
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce(['leadership'])
    const { result, rerender } = renderHook(
      ({ query }) => useCategorySuggestions(query),
      { initialProps: { query: 'le' } },
    )

    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS)
    rerender({ query: 'lea' })
    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS)
    await act(async () => first.resolve(['stale']))

    expect(result.current).toEqual(['leadership'])
  })

  test('shows no suggestions after a failed request and does not throw', async () => {
    fetchCategorySuggestions.mockResolvedValueOnce(['leadership'])
    const { result, rerender } = renderHook(
      ({ query }) => useCategorySuggestions(query),
      { initialProps: { query: 'lea' } },
    )

    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS)
    fetchCategorySuggestions.mockRejectedValueOnce(new Error('failed'))
    rerender({ query: 'lead' })
    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS)

    expect(result.current).toEqual([])
  })

  test('drops the suggestions when the query is cleared', async () => {
    fetchCategorySuggestions.mockResolvedValue(['leadership'])
    const { result, rerender } = renderHook(
      ({ query }) => useCategorySuggestions(query),
      { initialProps: { query: 'lea' } },
    )

    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS)
    expect(result.current).toEqual(['leadership'])

    rerender({ query: '' })

    expect(result.current).toEqual([])
  })

  test('does not request after the component is gone', async () => {
    const { unmount } = renderHook(() => useCategorySuggestions('lea'))

    unmount()
    await advance(CATEGORY_SUGGESTIONS_DEBOUNCE_MS)

    expect(fetchCategorySuggestions).not.toHaveBeenCalled()
  })
})
