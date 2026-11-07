'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MENU_ITEMS } from '@/constants'

export function MenuItems({ closeMenu = null, isReadOnly = false }) {
  const pathname = usePathname()
  const items = MENU_ITEMS.filter(({ isWrite }) => !(isReadOnly && isWrite))

  return items.map(({ text, href }) => {
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
