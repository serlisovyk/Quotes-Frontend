import { describe, expect, test, vi } from 'vitest'
import { fetchCategoriesResult } from '@/services/categories'
import { CATEGORY_SUGGESTIONS_LIMIT } from '@/constants'
import { GET } from './route.js'

vi.mock('@/services/categories', () => ({
  fetchCategoriesResult: vi.fn(),
}))

const createRequest = (query = '') =>
  new Request(`http://localhost/api/categories${query}`)

const categories = [
  { id: 1, name: 'leadership' },
  { id: 2, name: 'learning' },
]

describe('Categories route GET', () => {
  test('returns the categories that match the name', async () => {
    fetchCategoriesResult.mockResolvedValue({
      categories,
      total: 2,
      hasError: false,
    })

    const response = await GET(createRequest('?name=lea'))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ categories })
  })

  test('asks the service for the name with the fixed suggestions limit', async () => {
    fetchCategoriesResult.mockResolvedValue({
      categories,
      total: 2,
      hasError: false,
    })

    await GET(createRequest('?name=lea&limit=500&offset=3'))

    expect(fetchCategoriesResult).toHaveBeenCalledWith({
      name: 'lea',
      limit: CATEGORY_SUGGESTIONS_LIMIT,
    })
  })

  test('passes a name with uppercase letters as typed', async () => {
    fetchCategoriesResult.mockResolvedValue({
      categories,
      total: 2,
      hasError: false,
    })

    await GET(createRequest('?name=Lea-2'))

    expect(fetchCategoriesResult).toHaveBeenCalledWith({
      name: 'Lea-2',
      limit: CATEGORY_SUGGESTIONS_LIMIT,
    })
  })

  test.each([
    ['is missing', ''],
    ['is empty', '?name='],
    ['has spaces', '?name=two%20words'],
    ['has other characters', '?name=lea_der'],
    ['is too long', `?name=${'a'.repeat(51)}`],
  ])('answers 400 with no categories when the name %s', async (_, query) => {
    const response = await GET(createRequest(query))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ categories: [] })
    expect(fetchCategoriesResult).not.toHaveBeenCalled()
  })

  test('answers 502 with no categories when the backend read failed', async () => {
    fetchCategoriesResult.mockResolvedValue({
      categories: [],
      total: 0,
      hasError: true,
    })

    const response = await GET(createRequest('?name=lea'))

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ categories: [] })
  })
})
