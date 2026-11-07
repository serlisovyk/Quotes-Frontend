import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { renderQuoteText } from './render-quote-text.util.jsx'

const getHighlights = (container) =>
  Array.from(container.querySelectorAll('span')).map((span) => span.textContent)

describe('renderQuoteText utility function', () => {
  const fullText = 'The beginning of a text and the c++ ending'
  const visiblePart = 'The beginning of a text'

  test('should return the visible part for a short search text', () => {
    expect(
      renderQuoteText({
        fullText,
        visiblePart,
        searchText: 'ab',
        isTruncated: false,
      }),
    ).toBe(visiblePart)
  })

  test('should add the ellipsis to the visible part of a truncated text without a search text', () => {
    expect(
      renderQuoteText({ fullText, visiblePart, searchText: '', isTruncated: true }),
    ).toBe(`${visiblePart}...`)
  })

  test('should highlight a match inside the visible part', () => {
    const { container } = render(
      <p>
        {renderQuoteText({
          fullText,
          visiblePart,
          searchText: 'text',
          isTruncated: true,
        })}
      </p>,
    )

    expect(getHighlights(container)).toEqual(['text'])
    expect(container.textContent).toBe(`${visiblePart}...`)
  })

  test('should highlight the ellipsis when the match is outside the visible part', () => {
    const { container } = render(
      <p>
        {renderQuoteText({
          fullText,
          visiblePart,
          searchText: 'c++',
          isTruncated: true,
        })}
      </p>,
    )

    expect(getHighlights(container)).toEqual(['...'])
    expect(container.textContent).toBe(`${visiblePart}...`)
  })

  test('should return the visible part when a truncated text has no match', () => {
    expect(
      renderQuoteText({
        fullText,
        visiblePart,
        searchText: 'zzz',
        isTruncated: true,
      }),
    ).toBe(`${visiblePart}...`)
  })

  test('should return the visible part when a whole text has no match', () => {
    expect(
      renderQuoteText({
        fullText,
        visiblePart,
        searchText: 'zzz',
        isTruncated: false,
      }),
    ).toBe(visiblePart)
  })

  test('should highlight a special-character match inside the visible part', () => {
    const { container } = render(
      <p>
        {renderQuoteText({
          fullText: 'I like c++ a lot',
          visiblePart: 'I like c++ a lot',
          searchText: 'c++',
          isTruncated: false,
        })}
      </p>,
    )

    expect(getHighlights(container)).toEqual(['c++'])
  })
})
