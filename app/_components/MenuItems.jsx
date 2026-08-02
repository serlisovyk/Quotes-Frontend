import Link from 'next/link'
import { menuItems } from '@config/constants'

export default function MenuItems({ closeMenu = null }) {
  return menuItems.map(({ text, href }) => (
    <Link
      key={text}
      href={href}
      className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-400"
      onClick={closeMenu}
    >
      {text}
    </Link>
  ))
}
