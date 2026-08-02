'use client'

import { useRouter } from 'next/navigation'
import Button from '@components/Button'
import { DEFAULT_SEARCH_LIMIT, DEFAULT_SEARCH_OFFSET } from '@config/constants'
import { createSearchQueryString } from '@utils/queryString'

export default function Pagination({ total, queryParams, setQueryParams }) {
  const router = useRouter()

  const limit = Number(queryParams.limit) || DEFAULT_SEARCH_LIMIT
  const offset = Number(queryParams.offset) || DEFAULT_SEARCH_OFFSET

  if (total <= limit) return null

  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1

  const pages = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)

    const start = Math.max(currentPage - 2, 2)
    const end = Math.min(currentPage + 2, totalPages - 1)

    if (start > 2) pages.push('—')
    for (let p = start; p <= end; p++) pages.push(p)
    if (end < totalPages - 1) pages.push('—')

    pages.push(totalPages)
  }

  const updatePage = (page) => {
    const newOffset = (page - 1) * limit
    const updated = { ...queryParams, offset: newOffset }

    setQueryParams(updated)
    router.push(`?${createSearchQueryString(updated)}`)
  }

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-2 justify-start items-center mt-8 px-2 max-w-full">
      <Button
        text="Prev"
        disabled={currentPage === 1}
        onClick={() => updatePage(currentPage - 1)}
      />

      {pages.map((page) =>
        page === '—' ? (
          <span key={`dash-${page}`} className="px-2 select-none">
            —
          </span>
        ) : (
          <Button
            key={page}
            text={page.toString()}
            variant={page === currentPage ? 'primary' : 'secondary'}
            disabled={page === currentPage}
            onClick={() => updatePage(page)}
          />
        )
      )}

      <Button
        text="Next"
        disabled={currentPage === totalPages}
        onClick={() => updatePage(currentPage + 1)}
      />
    </div>
  )
}
