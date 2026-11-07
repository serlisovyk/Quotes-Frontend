import { createSearchQueryString } from '@/utils/query-string'
import {
  PAGINATION_ELLIPSIS,
  PAGINATION_MAX_LISTED_PAGES,
  PAGINATION_SIBLING_PAGES,
  ROUTES,
} from '@/constants'

const createRange = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index)

export function getPaginationPages(totalPages, currentPage) {
  if (totalPages <= PAGINATION_MAX_LISTED_PAGES) return createRange(1, totalPages)

  const start = Math.max(currentPage - PAGINATION_SIBLING_PAGES, 2)
  const end = Math.min(currentPage + PAGINATION_SIBLING_PAGES, totalPages - 1)
  const hasGapBefore = start > 2
  const hasGapAfter = end < totalPages - 1

  return [
    1,
    ...(hasGapBefore ? [PAGINATION_ELLIPSIS] : []),
    ...createRange(start, end),
    ...(hasGapAfter ? [PAGINATION_ELLIPSIS] : []),
    totalPages,
  ]
}

export function createPageHref(queryParams, page, limit) {
  const offset = (page - 1) * limit
  const query = createSearchQueryString({ ...queryParams, offset })

  return `${ROUTES.SEARCH}?${query}`
}
