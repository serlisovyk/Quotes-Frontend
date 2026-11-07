import { THEME_ICON_PATHS } from '@/constants'

export function ThemeIcon({ theme }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {THEME_ICON_PATHS[theme].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}
