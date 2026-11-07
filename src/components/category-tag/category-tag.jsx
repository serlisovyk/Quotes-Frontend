import Link from 'next/link'
import { createSearchQueryString } from '@/utils/query-string'
import { CATEGORY_TAG_CLASSES, ROUTES } from '@/constants'

export function CategoryTag({ category, selectedCategory, isSingleQuotePage }) {
  const isSelected = category.toLowerCase() === selectedCategory?.toLowerCase()
  const href = `${ROUTES.SEARCH}?${createSearchQueryString({ category })}`

  const getPageClasses = () => {
    if (isSingleQuotePage) return CATEGORY_TAG_CLASSES.singleQuote

    if (isSelected) return CATEGORY_TAG_CLASSES.selected

    return CATEGORY_TAG_CLASSES.default
  }

  return (
    <Link
      href={href}
      aria-current={isSelected ? 'true' : undefined}
      className={`${CATEGORY_TAG_CLASSES.base} ${getPageClasses()}`}
    >
      {category}
    </Link>
  )
}
