import { describe, expect, test } from 'vitest'
import { formatQuoteText } from './format-quote-text.util.js'

describe('Format Quote Text', () => {
  test('wraps the text in quotes and adds the author after a dash', () => {
    expect(formatQuoteText({ text: 'Be yourself', author: 'Oscar Wilde' })).toBe(
      '"Be yourself" — Oscar Wilde',
    )
  })

  test('keeps the full text without truncation', () => {
    const text = 'a'.repeat(500)

    expect(formatQuoteText({ text, author: 'Anon' })).toBe(`"${text}" — Anon`)
  })

  test('leaves the author out when it is empty', () => {
    expect(formatQuoteText({ text: 'Be yourself', author: '' })).toBe(
      '"Be yourself"',
    )
  })
})
