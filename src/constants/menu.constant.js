import { ROUTES } from './routes.constant.js'

export const MENU_ITEMS = [
  { href: ROUTES.HOME, text: 'Home' },
  { href: ROUTES.RANDOM, text: 'Random' },
  { href: ROUTES.SEARCH, text: 'Search' },
  { href: ROUTES.CREATE, text: 'Create New', isWrite: true },
]

export const MOBILE_MENU_ID = 'mobile-navigation'

export const DESKTOP_MENU_QUERY = '(min-width: 768px)'

export const MOBILE_MENU_CLASSES =
  'm-0 ml-auto h-full max-h-none w-3/4 max-w-none bg-transparent bg-linear-to-r from-transparent to-panel p-0 text-body backdrop:bg-overlay'
