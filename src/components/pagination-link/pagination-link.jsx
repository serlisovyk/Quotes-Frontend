import Link from 'next/link'
import { PAGINATION_LINK_CLASSES } from '@/constants'

export function PaginationLink(props) {
  const { children, href, isActive = false, isDisabled = false } = props

  const getVariantClasses = () => {
    if (isDisabled) return PAGINATION_LINK_CLASSES.disabled

    if (isActive) return PAGINATION_LINK_CLASSES.primary

    return PAGINATION_LINK_CLASSES.secondary
  }

  const className = `${PAGINATION_LINK_CLASSES.base} ${getVariantClasses()}`

  if (isActive) {
    return (
      <span aria-current="page" className={className}>
        {children}
      </span>
    )
  }

  if (isDisabled) {
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
