import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

const API_URL = 'http://api.test'

async function importFreshService() {
  vi.resetModules()
  process.env.API_URL = API_URL

  return import('./categories.service.js')
}

function createResponse({ ok, status = 200, body }) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  }
}

describe('Categories Service', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
    delete process.env.API_URL
  })

  describe('fetchCategories', () => {
    test('requests the categories endpoint with the query string and no-store', async () => {
      const body = { total: 1, categories: [{ id: 1, name: 'Life' }] }
      global.fetch.mockResolvedValue(createResponse({ ok: true, body }))

      const { fetchCategories } = await importFreshService()
      const result = await fetchCategories({ name: 'lif', limit: 3, offset: 6 })

      expect(result).toEqual(body)
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/categories?name=lif&limit=3&offset=6`,
        {
          cache: 'no-store',
          method: 'GET',
          headers: {},
          signal: expect.any(AbortSignal),
        },
      )
    })

    test('requests the bare endpoint without params', async () => {
      global.fetch.mockResolvedValue(
        createResponse({ ok: true, body: { total: 0, categories: [] } }),
      )

      const { fetchCategories } = await importFreshService()

      await fetchCategories()

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/categories`,
        expect.objectContaining({ cache: 'no-store' }),
      )
    })

    test('drops params the categories endpoint does not accept', async () => {
      global.fetch.mockResolvedValue(
        createResponse({ ok: true, body: { total: 0, categories: [] } }),
      )

      const { fetchCategories } = await importFreshService()

      await fetchCategories({ name: 'lif', text: 'sharp', foo: 'bar' })

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/categories?name=lif`,
        expect.any(Object),
      )
    })

    test('rejects with the API error on a failed response', async () => {
      global.fetch.mockResolvedValue(
        createResponse({
          ok: false,
          status: 400,
          body: { error: { message: 'Bad request' } },
        }),
      )

      const { fetchCategories } = await importFreshService()

      await expect(fetchCategories({ limit: 100 })).rejects.toMatchObject({
        status: 400,
      })
    })
  })

  describe('fetchCategoriesResult', () => {
    test('returns the categories and the total on success', async () => {
      global.fetch.mockResolvedValue(
        createResponse({
          ok: true,
          body: {
            total: 12,
            categories: [
              { id: 1, name: 'Life' },
              { id: 2, name: 'Wisdom' },
            ],
          },
        }),
      )

      const { fetchCategoriesResult } = await importFreshService()

      await expect(fetchCategoriesResult({ limit: 2 })).resolves.toEqual({
        categories: [
          { id: 1, name: 'Life' },
          { id: 2, name: 'Wisdom' },
        ],
        total: 12,
        hasError: false,
      })
    })

    test('returns an empty result without an error when nothing matches', async () => {
      global.fetch.mockResolvedValue(
        createResponse({ ok: true, body: { total: 0, categories: [] } }),
      )

      const { fetchCategoriesResult } = await importFreshService()

      await expect(fetchCategoriesResult({ name: 'zzz' })).resolves.toEqual({
        categories: [],
        total: 0,
        hasError: false,
      })
    })

    test('falls back to no categories and a zero total when the response omits them', async () => {
      global.fetch.mockResolvedValue(createResponse({ ok: true, body: {} }))

      const { fetchCategoriesResult } = await importFreshService()

      await expect(fetchCategoriesResult()).resolves.toEqual({
        categories: [],
        total: 0,
        hasError: false,
      })
    })

    test('returns an empty result with the error flag on a failed response', async () => {
      global.fetch.mockResolvedValue(
        createResponse({
          ok: false,
          status: 500,
          body: { error: { message: 'Some error occurred' } },
        }),
      )

      const { fetchCategoriesResult } = await importFreshService()

      await expect(fetchCategoriesResult()).resolves.toEqual({
        categories: [],
        total: 0,
        hasError: true,
      })
    })

    test('returns an empty result with the error flag on a network error', async () => {
      global.fetch.mockRejectedValue(new Error('network down'))

      const { fetchCategoriesResult } = await importFreshService()

      await expect(fetchCategoriesResult()).resolves.toEqual({
        categories: [],
        total: 0,
        hasError: true,
      })
    })
  })
})
