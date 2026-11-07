import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthorLink } from './author-link.jsx'

describe('Author Link', () => {
  test('is named after the quotes of the author, not after the dash', () => {
    render(<AuthorLink author="Winston Churchill" />)

    expect(
      screen.getByRole('link', { name: 'Quotes by Winston Churchill' }),
    ).toBeVisible()
  })

  test('still shows the dash and the author name', () => {
    render(<AuthorLink author="Winston Churchill" />)

    expect(screen.getByRole('link')).toHaveTextContent('- Winston Churchill')
  })

  test.each([
    ['A & B', '/search?author=A+%26+B'],
    ['C#', '/search?author=C%23'],
    ['Albert Einstein', '/search?author=Albert+Einstein'],
  ])('links to the search for the author %s', (author, href) => {
    render(<AuthorLink author={author} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', href)
  })
})
