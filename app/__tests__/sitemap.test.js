import sitemap from '../sitemap'

jest.mock('@config/site', () => ({
  SITE_URL: 'http://localhost:4000',
}))

describe('Sitemap', () => {
  it('lists the public pages', () => {
    const urls = sitemap().map(({ url }) => url)

    expect(urls).toEqual([
      'http://localhost:4000/',
      'http://localhost:4000/random',
      'http://localhost:4000/search',
    ])
  })

  it('does not list the create page', () => {
    const urls = sitemap().map(({ url }) => url)

    expect(urls).not.toContain('http://localhost:4000/quotes/create')
  })
})
