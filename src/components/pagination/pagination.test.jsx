import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pagination } from './pagination.jsx'

const renderPagination = (total, queryParams = {}) =>
  render(<Pagination total={total} queryParams={queryParams} />)

describe('Pagination', () => {
  test('counts pages by the limit when the offset is uneven', () => {
    renderPagination(40, { limit: '10', offset: '5' })

    expect(screen.getByText('1').getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: 'Next' }).getAttribute('href')).toBe(
      '/search?limit=10&offset=10',
    )
  })

  test('treats a negative offset as the first page', () => {
    renderPagination(40, { limit: '10', offset: '-5' })

    expect(screen.getByText('1').getAttribute('aria-current')).toBe('page')
    expect(screen.getByText('Prev').getAttribute('aria-disabled')).toBe('true')
  })

  test('renders nothing when everything fits on one page', () => {
    const { container } = renderPagination(10, { limit: '10' })

    expect(container.firstChild).toBeNull()
  })

  test('renders a navigation with the pages, Prev and Next', () => {
    renderPagination(30, { text: 'life' })

    const nav = screen.getByRole('navigation', { name: 'Quotes pagination' })

    expect(nav).toBeTruthy()
    expect(screen.getByText('Prev').getAttribute('aria-disabled')).toBe('true')
    expect(screen.getByRole('link', { name: 'Next' }).getAttribute('href')).toBe(
      '/search?text=life&offset=10',
    )
    expect(screen.getByText('1').getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: '3' }).getAttribute('href')).toBe(
      '/search?text=life&offset=20',
    )
  })

  test('marks the page of the offset as current and enables Prev', () => {
    renderPagination(30, { limit: '10', offset: '10' })

    expect(screen.getByText('2').getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: 'Prev' }).getAttribute('href')).toBe(
      '/search?limit=10&offset=0',
    )
  })

  test('disables Next on the last page', () => {
    renderPagination(30, { offset: '20' })

    expect(screen.getByText('Next').getAttribute('aria-disabled')).toBe('true')
    expect(screen.queryByRole('link', { name: 'Next' })).toBeNull()
  })

  test('does not style the current page as disabled', () => {
    renderPagination(30, { text: 'life' })

    expect(screen.getByText('1')).toHaveClass('bg-accent', 'font-bold')
    expect(screen.getByText('1')).not.toHaveClass('cursor-not-allowed')
    expect(screen.getByText('Prev')).toHaveClass('cursor-not-allowed')
  })

  test('shortens a long list of pages with separators', () => {
    renderPagination(200, { offset: '90' })

    expect(screen.getAllByText('...')).toHaveLength(2)
    expect(screen.getByText('10').getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: '20' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: '5' })).toBeNull()
  })

  test('uses the limit of the query to count the pages', () => {
    renderPagination(30, { limit: '5' })

    expect(screen.getByRole('link', { name: '6' })).toBeTruthy()
  })
})
