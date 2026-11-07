import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
const API_URL = 'http://api.test'

async function importFreshServices() {
  vi.resetModules()
  process.env.API_URL = API_URL

  return import('./quotes.service.js')
}

function createResponse({ ok, status = 200, body }) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  }
}

describe('Services result helpers', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
    delete process.env.API_URL
  })

  test('returns random quotes result without error on success', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: true,
        body: [{ id: 1, text: 'Stay sharp' }],
      }),
    )

    const { fetchRandomQuotesResult } = await importFreshServices()
    const result = await fetchRandomQuotesResult()

    expect(result).toEqual({
      quotes: [{ id: 1, text: 'Stay sharp' }],
      hasError: false,
    })
  })

  test('returns empty random quotes result with error flag on failure', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: false,
        status: 500,
        body: {
          error: {
            message: 'Some error occurred',
          },
        },
      }),
    )

    const { fetchRandomQuotesResult } = await importFreshServices()
    const result = await fetchRandomQuotesResult()

    expect(result).toEqual({
      quotes: [],
      hasError: true,
    })
  })

  test('returns normalized search result on success', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: true,
        body: {
          quotes: [{ id: 1, text: 'Stay sharp' }],
          total: 20,
        },
      }),
    )

    const { fetchQuotesResult } = await importFreshServices()
    const result = await fetchQuotesResult({ text: 'sharp' })

    expect(result).toEqual({
      quotes: [{ id: 1, text: 'Stay sharp' }],
      total: 20,
      hasError: false,
    })
  })

  test('falls back to no quotes and a zero total when the response omits them', async () => {
    global.fetch.mockResolvedValue(createResponse({ ok: true, body: {} }))

    const { fetchQuotesResult } = await importFreshServices()

    await expect(fetchQuotesResult()).resolves.toEqual({
      quotes: [],
      total: 0,
      hasError: false,
    })
  })

  test('returns empty search result with error flag on failure', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: false,
        status: 500,
        body: {
          error: {
            message: 'Some error occurred',
          },
        },
      }),
    )

    const { fetchQuotesResult } = await importFreshServices()
    const result = await fetchQuotesResult({ text: 'sharp' })

    expect(result).toEqual({
      quotes: [],
      total: 0,
      hasError: true,
    })
  })

  test('sends only the search params to the quotes endpoint', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, body: { quotes: [], total: 0 } }),
    )

    const { fetchQuotes } = await importFreshServices()

    await fetchQuotes({
      text: 'sharp',
      author: 'Ann',
      category: 'Life',
      limit: 10,
      offset: 20,
      name: 'lif',
    })

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes?text=sharp&author=Ann&category=Life&limit=10&offset=20`,
      expect.any(Object),
    )
  })

  test('uses no-store for search requests', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: true,
        body: {
          quotes: [],
          total: 0,
        },
      }),
    )

    const { fetchQuotes } = await importFreshServices()
    await fetchQuotes({ text: 'sharp' })

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes?text=sharp`,
      expect.objectContaining({
        cache: 'no-store',
      }),
    )
  })

  test('uses no-store for random quote requests', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: true,
        body: [],
      }),
    )

    const { fetchRandomQuotes } = await importFreshServices()
    await fetchRandomQuotes()

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes/random`,
      expect.objectContaining({
        cache: 'no-store',
      }),
    )
  })

  test('uses quote details revalidation by default for single quote requests', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: true,
        body: { id: 1, text: 'Stay sharp' },
      }),
    )

    const { fetchQuoteById, QUOTE_DETAILS_FETCH_OPTIONS } =
      await importFreshServices()
    await fetchQuoteById(1)

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes/1`,
      expect.objectContaining(QUOTE_DETAILS_FETCH_OPTIONS),
    )
  })

  test('allows callers to override single quote cache behavior', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: true,
        body: { id: 1, text: 'Stay sharp' },
      }),
    )

    const { fetchQuoteById } = await importFreshServices()
    await fetchQuoteById(1, { cache: 'no-store' })

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes/1`,
      expect.objectContaining({
        cache: 'no-store',
      }),
    )
  })
})

describe('fetchQuoteIfExists', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
    delete process.env.API_URL
  })

  test('returns the quote on success', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, body: { id: 1, text: 'Stay sharp' } }),
    )

    const { fetchQuoteIfExists } = await importFreshServices()

    await expect(fetchQuoteIfExists(1)).resolves.toEqual({
      id: 1,
      text: 'Stay sharp',
    })
  })

  test('returns null when the API answers 404', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: false,
        status: 404,
        body: { error: { message: 'Quote not found' } },
      }),
    )

    const { fetchQuoteIfExists } = await importFreshServices()

    await expect(fetchQuoteIfExists(999)).resolves.toBeNull()
  })

  test('rethrows a server error', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: false,
        status: 500,
        body: { error: { message: 'Boom' } },
      }),
    )

    const { fetchQuoteIfExists } = await importFreshServices()

    await expect(fetchQuoteIfExists(1)).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
    })
  })

  test('rethrows a network error', async () => {
    global.fetch.mockRejectedValue(new TypeError('fetch failed'))

    const { fetchQuoteIfExists } = await importFreshServices()

    await expect(fetchQuoteIfExists(1)).rejects.toThrow('fetch failed')
  })

  test('passes the fetch options through', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, body: { id: 1, text: 'Stay sharp' } }),
    )

    const { fetchQuoteIfExists } = await importFreshServices()
    await fetchQuoteIfExists(1, { cache: 'no-store' })

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes/1`,
      expect.objectContaining({ cache: 'no-store' }),
    )
  })
})

describe('fetchQuoteByIdOrNull', () => {
  afterEach(() => {
    delete global.fetch
    delete process.env.API_URL
  })

  test('still returns null for any failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'))

    const { fetchQuoteByIdOrNull } = await importFreshServices()

    await expect(fetchQuoteByIdOrNull(1)).resolves.toBeNull()
  })
})

describe('Quote mutations', () => {
  const payload = { text: 'Stay sharp', author: 'Someone', categories: ['life'] }

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
    delete process.env.API_URL
  })

  test('postQuote posts the payload to the quotes endpoint', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, status: 201, body: { id: 5, ...payload } }),
    )

    const { postQuote } = await importFreshServices()

    await expect(postQuote(payload)).resolves.toEqual({ id: 5, ...payload })
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes`,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) }),
    )
  })

  test('patchQuote patches the payload on the single quote endpoint', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, body: { id: 5, ...payload } }),
    )

    const { patchQuote } = await importFreshServices()
    await patchQuote(5, payload)

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes/5`,
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify(payload) }),
    )
  })

  test('deleteQuote deletes the single quote and returns true', async () => {
    global.fetch.mockResolvedValue(createResponse({ ok: true, status: 204 }))

    const { deleteQuote } = await importFreshServices()

    await expect(deleteQuote(5)).resolves.toBe(true)
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes/5`,
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  test('postQuote rejects with the API error', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: false,
        status: 400,
        body: { error: { message: 'Invalid request data' } },
      }),
    )

    const { postQuote } = await importFreshServices()

    await expect(postQuote(payload)).rejects.toMatchObject({
      message: 'Invalid request data',
      status: 400,
    })
  })
})
