const API_URL = 'http://api.test'

async function importFreshFetcher({ apiUrl = API_URL } = {}) {
  jest.resetModules()
  process.env.API_URL = apiUrl

  const fetcherModule = await import('./api.fetcher.js')

  return fetcherModule.fetcher
}

function createResponse({ ok, status = 200, body }) {
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  }
}

describe('Services fetcher', () => {
  beforeEach(() => (global.fetch = jest.fn()))

  afterEach(() => {
    delete global.fetch
    delete process.env.API_URL
    jest.clearAllMocks()
  })

  test('returns JSON data for successful GET requests with query params', async () => {
    const responseBody = { total: 1, quotes: [{ id: 1, text: 'Stay sharp' }] }
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: responseBody }),
    )

    const fetcher = await importFreshFetcher()
    const result = await fetcher.get('quotes', { text: 'sharp', limit: 10 })

    expect(result).toEqual(responseBody)
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/quotes?text=sharp&limit=10`,
      {
        method: 'GET',
        headers: {},
      },
    )
  })

  test('uses API_URL for server requests', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: { quotes: [] } }),
    )

    const fetcher = await importFreshFetcher({
      apiUrl: 'http://private-api.test',
    })

    await fetcher.get('quotes')

    expect(global.fetch).toHaveBeenCalledWith('http://private-api.test/quotes', {
      method: 'GET',
      headers: {},
    })
  })

  test('passes Next fetch options through to GET requests', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: { quotes: [] } }),
    )

    const fetcher = await importFreshFetcher()

    await fetcher.get('quotes', {}, { cache: 'no-store' })

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/quotes`, {
      method: 'GET',
      headers: {},
      cache: 'no-store',
    })
  })

  test('returns true for successful DELETE requests without parsing JSON', async () => {
    const json = jest.fn()
    global.fetch.mockResolvedValue({
      ok: true,
      status: 204,
      json,
    })

    const fetcher = await importFreshFetcher()
    const result = await fetcher.delete('quotes/1')

    expect(result).toBe(true)
    expect(json).not.toHaveBeenCalled()
  })

  test('throws normalized backend errors with code and fields', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: false,
        status: 400,
        body: {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            fields: {
              limit: 'Limit must be in range 1..50',
            },
          },
        },
      }),
    )

    const fetcher = await importFreshFetcher()

    await expect(fetcher.get('quotes', { limit: 100 })).rejects.toMatchObject({
      message: 'Invalid request data',
      status: 400,
      code: 'VALIDATION_ERROR',
      fields: {
        limit: 'Limit must be in range 1..50',
      },
    })
  })
})
