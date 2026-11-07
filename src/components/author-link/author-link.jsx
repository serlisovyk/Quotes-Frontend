import Link from 'next/link'
import { createSearchQueryString } from '@/utils/query-string'
import { LINK_FOCUS_CLASSES, ROUTES } from '@/constants'

export function AuthorLink({ author }) {
  const href = `${ROUTES.SEARCH}?${createSearchQueryString({ author })}`

  return (
    <Link
      href={href}
      aria-label={`Quotes by ${author}`}
      className={LINK_FOCUS_CLASSES}
    >
      <span aria-hidden="true">- </span>

      <span className="hover:text-link-hover hover:underline">{author}</span>
    </Link>
  )
}
