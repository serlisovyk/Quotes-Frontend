import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PaginationLink } from './pagination-link.jsx'

describe('Pagination Link', () => {
  test('is a link to its page by default', () => {
    render(<PaginationLink href="/search?offset=10">2</PaginationLink>)

    const link = screen.getByRole('link', { name: '2' })

    expect(link.getAttribute('href')).toBe('/search?offset=10')
  })

  test('marks the current page and is not a link', () => {
    render(
      <PaginationLink href="/search?offset=0" isActive>
        1
      </PaginationLink>,
    )

    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('1').getAttribute('aria-current')).toBe('page')
  })

  test('is disabled and not a link', () => {
    render(
      <PaginationLink href="/search?offset=0" isDisabled>
        Prev
      </PaginationLink>,
    )

    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('Prev').getAttribute('aria-disabled')).toBe('true')
  })
})
