import { render } from '@testing-library/react'
import { highlightText, renderQuoteText } from '@utils/utils'
import { HIGHLIGHT_STYLES } from '@/constants'

const getHighlights = (container) =>
  Array.from(container.querySelectorAll('span')).map((span) => span.textContent)

describe('highlightText utility function', () => {
  test('should return the text unchanged for a short search text', () => {
    expect(highlightText('some text', 'so')).toBe('some text')
  })

  test('should return the text unchanged for an empty search text', () => {
    expect(highlightText('some text', '')).toBe('some text')
  })

  test('should highlight every match regardless of the case', () => {
    const { container } = render(
      <p>{highlightText('Life is life, LIFE', 'life')}</p>,
    )

    expect(getHighlights(container)).toEqual(['Life', 'life', 'LIFE'])
    expect(container.querySelector('span').className).toBe(HIGHLIGHT_STYLES)
    expect(container.textContent).toBe('Life is life, LIFE')
  })

  test.each([
    ['c++', 'I like c++ and C++ a lot', ['c++', 'C++']],
    ['(ab', 'text (ab) text', ['(ab']],
    ['a.*', 'see a.* here', ['a.*']],
    ['a|b', 'x a|b y', ['a|b']],
    ['[xy', 'a [xy b', ['[xy']],
    ['a\\b', 'a\\b', ['a\\b']],
  ])(
    'should highlight the special characters in %s literally',
    (searchText, text, expected) => {
      const { container } = render(<p>{highlightText(text, searchText)}</p>)

      expect(getHighlights(container)).toEqual(expected)
      expect(container.textContent).toBe(text)
    },
  )

  test('should not highlight anything when the text has no match', () => {
    const { container } = render(<p>{highlightText('some text', 'c++')}</p>)

    expect(getHighlights(container)).toEqual([])
    expect(container.textContent).toBe('some text')
  })
})

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
