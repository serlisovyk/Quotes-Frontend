import { PaginationLink } from '@/components/pagination-link'
import { createPageHref, getPaginationPages } from '@/utils/pagination'
import {
  DEFAULT_SEARCH_LIMIT,
  DEFAULT_SEARCH_OFFSET,
  PAGINATION_ELLIPSIS,
} from '@/constants'

export function Pagination({ total, queryParams }) {
  const limit = Number(queryParams.limit) || DEFAULT_SEARCH_LIMIT
  const offset = Number(queryParams.offset) || DEFAULT_SEARCH_OFFSET

  if (total <= limit) return null

  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1
  const pages = getPaginationPages(totalPages, currentPage)

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <nav
      aria-label="Quotes pagination"
      className="flex flex-nowrap overflow-x-auto gap-2 justify-start items-center mt-8 px-2 max-w-full"
    >
      <PaginationLink
        href={createPageHref(queryParams, currentPage - 1, limit)}
        isDisabled={isFirstPage}
      >
        Prev
      </PaginationLink>

      {pages.map((page, index) => {
        if (page === PAGINATION_ELLIPSIS) {
          return (
            <span key={`separator-${index}`} className="px-2 select-none">
              {PAGINATION_ELLIPSIS}
            </span>
          )
        }

        const isCurrentPage = page === currentPage

        return (
          <PaginationLink
            key={page}
            href={createPageHref(queryParams, page, limit)}
            isActive={isCurrentPage}
            isDisabled={isCurrentPage}
          >
            {page}
          </PaginationLink>
        )
      })}

      <PaginationLink
        href={createPageHref(queryParams, currentPage + 1, limit)}
        isDisabled={isLastPage}
      >
        Next
      </PaginationLink>
    </nav>
  )
}
