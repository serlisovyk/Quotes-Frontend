'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MENU_ITEMS } from '@/constants'

export function MenuItems({ closeMenu = null }) {
  const pathname = usePathname()

  return MENU_ITEMS.map(({ text, href }) => {
    const isActive = pathname === href

    return (
      <Link
        key={text}
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={`rounded-sm transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
          isActive ? 'text-accent-text' : 'text-body hover:text-muted'
        }`}
        onClick={closeMenu}
      >
        {text}
      </Link>
    )
  })
}
