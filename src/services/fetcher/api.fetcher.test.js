import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { API_REQUEST_TIMEOUT_MS } from '@/constants'

const API_URL = 'http://api.test'

async function importFreshFetcher({ apiUrl = API_URL } = {}) {
  vi.resetModules()
  process.env.API_URL = apiUrl

  const fetcherModule = await import('./api.fetcher.js')

  return fetcherModule.fetcher
}

function createResponse({ ok, status = 200, body }) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  }
}

describe('Services fetcher', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
    delete process.env.API_URL
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
        signal: expect.any(AbortSignal),
      },
    )
  })

  test('keeps the name param of the categories list in the URL', async () => {
    global.fetch.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: { total: 0, categories: [] },
      }),
    )

    const fetcher = await importFreshFetcher()

    await fetcher.get('categories', { name: 'lif', limit: 3 })

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_URL}/categories?name=lif&limit=3`,
      { method: 'GET', headers: {}, signal: expect.any(AbortSignal) },
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
      signal: expect.any(AbortSignal),
    })
  })

  test.each(['http://api.test/', 'http://api.test//', 'http://api.test'])(
    'builds one URL without a double slash for API_URL %s',
    async (apiUrl) => {
      global.fetch.mockResolvedValue(
        createResponse({ ok: true, status: 200, body: { quotes: [] } }),
      )

      const fetcher = await importFreshFetcher({ apiUrl })

      await fetcher.get('quotes', { text: 'sharp' })
      await fetcher.get('quotes')

      expect(global.fetch.mock.calls[0][0]).toBe('http://api.test/quotes?text=sharp')
      expect(global.fetch.mock.calls[1][0]).toBe('http://api.test/quotes')
    },
  )

  test('ignores a leading slash of the endpoint', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: {} }),
    )

    const fetcher = await importFreshFetcher({ apiUrl: 'http://api.test/' })

    await fetcher.delete('/quotes/1')

    expect(global.fetch.mock.calls[0][0]).toBe('http://api.test/quotes/1')
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
      signal: expect.any(AbortSignal),
      cache: 'no-store',
    })
  })

  test('returns true for successful DELETE requests without parsing JSON', async () => {
    const json = vi.fn()
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

  describe('timeout', () => {
    const mockTimeoutSignal = () => {
      const timeoutController = new AbortController()
      const timeoutSpy = vi
        .spyOn(AbortSignal, 'timeout')
        .mockReturnValue(timeoutController.signal)

      return { timeoutController, timeoutSpy }
    }

    test('gives every request a signal that fires after the request timeout', async () => {
      const { timeoutController, timeoutSpy } = mockTimeoutSignal()
      global.fetch.mockResolvedValue(createResponse({ ok: true, body: {} }))

      const fetcher = await importFreshFetcher()
      await fetcher.get('quotes')

      const { signal } = global.fetch.mock.calls[0][1]

      expect(timeoutSpy).toHaveBeenCalledWith(API_REQUEST_TIMEOUT_MS)
      expect(signal.aborted).toBe(false)

      timeoutController.abort()

      expect(signal.aborted).toBe(true)
    })

    test('rejects when the backend never answers before the timeout', async () => {
      const { timeoutController } = mockTimeoutSignal()
      global.fetch.mockImplementation(
        (_url, { signal }) =>
          new Promise((_resolve, reject) => {
            signal.addEventListener('abort', () => reject(signal.reason))
          }),
      )

      const fetcher = await importFreshFetcher()
      const request = fetcher.get('quotes')

      timeoutController.abort(new DOMException('Timed out', 'TimeoutError'))

      await expect(request).rejects.toMatchObject({ name: 'TimeoutError' })
    })

    test('aborts the request when the caller signal fires first', async () => {
      mockTimeoutSignal()
      global.fetch.mockResolvedValue(createResponse({ ok: true, body: {} }))
      const callerController = new AbortController()

      const fetcher = await importFreshFetcher()
      await fetcher.get('quotes', '', { signal: callerController.signal })

      const { signal } = global.fetch.mock.calls[0][1]

      expect(signal.aborted).toBe(false)

      callerController.abort()

      expect(signal.aborted).toBe(true)
    })

    test('aborts the request when the timeout fires while the caller signal is idle', async () => {
      const { timeoutController } = mockTimeoutSignal()
      global.fetch.mockResolvedValue(createResponse({ ok: true, body: {} }))
      const callerController = new AbortController()

      const fetcher = await importFreshFetcher()
      await fetcher.get('quotes', '', { signal: callerController.signal })

      const { signal } = global.fetch.mock.calls[0][1]

      timeoutController.abort()

      expect(signal.aborted).toBe(true)
      expect(callerController.signal.aborted).toBe(false)
    })
  })

  test('throws before any request when API_URL is missing', async () => {
    const fetcher = await importFreshFetcher({ apiUrl: '' })

    await expect(fetcher.get('quotes')).rejects.toThrow(
      'API_URL environment variable is required.',
    )
    expect(global.fetch).not.toHaveBeenCalled()
  })

  test.each([
    ['post', 'POST'],
    ['patch', 'PATCH'],
  ])('sends a JSON body with %s requests', async (methodName, method) => {
    const payload = { text: 'Stay sharp', author: 'Someone' }
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: { id: 1 } }),
    )

    const fetcher = await importFreshFetcher()
    const result = await fetcher[methodName]('quotes/1', payload)

    expect(result).toEqual({ id: 1 })
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/quotes/1`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      signal: expect.any(AbortSignal),
      body: JSON.stringify(payload),
    })
  })

  test('keeps the caller headers next to the JSON content type', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: {} }),
    )

    const fetcher = await importFreshFetcher()
    await fetcher.post('quotes', { text: 'x' }, { headers: { 'X-Trace': '1' } })

    expect(global.fetch.mock.calls[0][1].headers).toEqual({
      'X-Trace': '1',
      'Content-Type': 'application/json',
    })
  })

  test('sends no body and no content type with GET and DELETE requests', async () => {
    global.fetch.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: {} }),
    )

    const fetcher = await importFreshFetcher()
    await fetcher.get('quotes')
    await fetcher.delete('quotes/1')

    expect(global.fetch.mock.calls[0][1]).toEqual({
      method: 'GET',
      headers: {},
      signal: expect.any(AbortSignal),
    })
    expect(global.fetch.mock.calls[1][1]).toEqual({
      method: 'DELETE',
      headers: {},
      signal: expect.any(AbortSignal),
    })
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
