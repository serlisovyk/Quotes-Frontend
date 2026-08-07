import Link from 'next/link'
import { DEFAULT_SEARCH_LIMIT, DEFAULT_SEARCH_OFFSET } from '@config/constants'
import { createSearchQueryString } from '@utils/queryString'

const baseClasses =
  'inline-flex min-w-12 justify-center px-4 py-3 text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50'

const variants = {
  primary: 'bg-violet-900 text-white focus:ring-violet-600 hover:bg-violet-700',
  secondary: 'bg-gray-300 text-gray-800 focus:ring-blue-500 hover:bg-gray-400',
  disabled: 'bg-gray-300 text-gray-800 opacity-50 cursor-not-allowed',
}

function createPageHref(queryParams, page, limit) {
  const offset = (page - 1) * limit
  const query = createSearchQueryString({ ...queryParams, offset })

  return query ? `/search?${query}` : '/search'
}

function PaginationLink({ children, href, active = false, disabled = false }) {
  const className = `${baseClasses} ${
    disabled ? variants.disabled : active ? variants.primary : variants.secondary
  }`

  if (disabled) {
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export default function Pagination({ total, queryParams }) {
  const limit = Number(queryParams.limit) || DEFAULT_SEARCH_LIMIT
  const offset = Number(queryParams.offset) || DEFAULT_SEARCH_OFFSET

  if (total <= limit) return null

  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1
  const pages = []

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page++) pages.push(page)
  } else {
    pages.push(1)

    const start = Math.max(currentPage - 2, 2)
    const end = Math.min(currentPage + 2, totalPages - 1)

    if (start > 2) pages.push('...')
    for (let page = start; page <= end; page++) pages.push(page)
    if (end < totalPages - 1) pages.push('...')

    pages.push(totalPages)
  }

  return (
    <nav
      aria-label="Quotes pagination"
      className="flex flex-nowrap overflow-x-auto gap-2 justify-start items-center mt-8 px-2 max-w-full"
    >
      <PaginationLink
        href={createPageHref(queryParams, currentPage - 1, limit)}
        disabled={currentPage === 1}
      >
        Prev
      </PaginationLink>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`separator-${index}`} className="px-2 select-none">
            ...
          </span>
        ) : (
          <PaginationLink
            key={page}
            href={createPageHref(queryParams, page, limit)}
            active={page === currentPage}
            disabled={page === currentPage}
          >
            {page}
          </PaginationLink>
        ),
      )}

      <PaginationLink
        href={createPageHref(queryParams, currentPage + 1, limit)}
        disabled={currentPage === totalPages}
      >
        Next
      </PaginationLink>
    </nav>
  )
}
