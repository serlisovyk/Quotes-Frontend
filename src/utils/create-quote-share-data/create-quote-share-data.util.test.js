import { describe, expect, test } from 'vitest'
import { createQuoteShareData } from './create-quote-share-data.util.js'

describe('Create Quote Share Data', () => {
  const quote = { id: 7, text: 'Be yourself', author: 'Oscar Wilde' }

  test('builds the title, the text and the absolute link of the quote', () => {
    expect(
      createQuoteShareData({ quote, origin: 'https://quotes.example' }),
    ).toEqual({
      title: 'Quote by Oscar Wilde',
      text: '"Be yourself" — Oscar Wilde',
      url: 'https://quotes.example/quotes/7',
    })
  })

  test('uses a generic title without an author', () => {
    const { title } = createQuoteShareData({
      quote: { ...quote, author: '' },
      origin: 'http://localhost:4000',
    })

    expect(title).toBe('Quote')
  })
})
