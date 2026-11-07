import { describe, expect, test, vi } from 'vitest'
import sitemap from './sitemap'

vi.mock('@/config', () => ({
  SITE_URL: 'http://localhost:4000',
}))

describe('Sitemap', () => {
  test('lists the public pages', () => {
    const urls = sitemap().map(({ url }) => url)

    expect(urls).toEqual([
      'http://localhost:4000/',
      'http://localhost:4000/random',
      'http://localhost:4000/search',
    ])
  })

  test('does not list the create page', () => {
    const urls = sitemap().map(({ url }) => url)

    expect(urls).not.toContain('http://localhost:4000/quotes/create')
  })
})
