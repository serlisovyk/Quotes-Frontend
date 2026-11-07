import { QUOTE_ACTION_ICON_PATHS } from '@/constants'

export function QuoteActionIcon({ icon }) {
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
      {QUOTE_ACTION_ICON_PATHS[icon].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}
