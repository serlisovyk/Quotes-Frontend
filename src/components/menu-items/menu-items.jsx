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
        className={`rounded-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
          isActive
            ? 'text-violet-700 dark:text-violet-300'
            : 'text-gray-800 hover:text-gray-600 dark:text-white dark:hover:text-gray-400'
        }`}
        onClick={closeMenu}
      >
        {text}
      </Link>
    )
  })
}
