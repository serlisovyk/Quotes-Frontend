import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { fetchCategorySuggestions } from './category-suggestions.service.js'

const createResponse = ({ ok, body }) => ({
  ok,
  json: vi.fn().mockResolvedValue(body),
})

describe('Category Suggestions Service', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
  })

  test('requests the suggestions route with the encoded name and the signal', async () => {
    const { signal } = new AbortController()
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, body: { categories: [] } }),
    )

    await fetchCategorySuggestions('lea-2', signal)

    expect(global.fetch).toHaveBeenCalledWith('/api/categories?name=lea-2', {
      signal,
    })
  })

  test('returns the names of the categories', async () => {
    const body = {
      categories: [
        { id: 1, name: 'leadership' },
        { id: 2, name: 'learning' },
      ],
    }
    global.fetch.mockResolvedValue(createResponse({ ok: true, body }))

    const names = await fetchCategorySuggestions('lea')

    expect(names).toEqual(['leadership', 'learning'])
  })

  test('throws when the route answers with an error', async () => {
    global.fetch.mockResolvedValue(createResponse({ ok: false, body: {} }))

    await expect(fetchCategorySuggestions('lea')).rejects.toThrow()
  })
})
