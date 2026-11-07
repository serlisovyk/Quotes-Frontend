import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { HIGHLIGHT_STYLES } from '@/constants'
import { highlightText } from './highlight-text.util.jsx'

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
