import Link from 'next/link'
import {
  BUTTON_BASE_CLASSES,
  BUTTON_DISABLED_LINK_CLASSES,
  BUTTON_VARIANT_CLASSES,
} from '@/constants'

export function Button(props) {
  const {
    onClick,
    text,
    href,
    type = 'button',
    variant = 'primary',
    disabled = false,
  } = props

  const isDisabledLink = Boolean(href) && disabled
  const disabledLinkClasses = isDisabledLink ? BUTTON_DISABLED_LINK_CLASSES : ''
  const variantClasses = BUTTON_VARIANT_CLASSES[variant]
  const className =
    `${BUTTON_BASE_CLASSES} ${variantClasses} ${disabledLinkClasses}`.trim()

  if (href) {
    const linkProps = disabled ? { 'aria-disabled': true, tabIndex: -1 } : {}

    return (
      <Link href={href} className={className} {...linkProps}>
        {text}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {text}
    </button>
  )
}
