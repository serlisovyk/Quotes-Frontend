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
})
