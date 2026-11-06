const API_URL = 'http://api.test'

async function importFreshServices() {
  jest.resetModules()
  process.env.API_URL = API_URL

  return import('@services/services')
}

function createResponse({ ok, status = 200, body }) {
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  }
}

describe('Services result helpers', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    delete global.fetch
    delete process.env.API_URL
    jest.clearAllMocks()
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
    global.fetch = jest.fn()
  })

  afterEach(() => {
    delete global.fetch
    delete process.env.API_URL
    jest.clearAllMocks()
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
    global.fetch = jest.fn().mockRejectedValue(new TypeError('fetch failed'))

    const { fetchQuoteByIdOrNull } = await importFreshServices()

    await expect(fetchQuoteByIdOrNull(1)).resolves.toBeNull()
  })
})
