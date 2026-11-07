import { QuoteActionIcon } from '@/components/quote-action-icon'
import { QUOTE_ACTION_BUTTON_CLASSES } from '@/constants'

export function QuoteActionButton({ label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={QUOTE_ACTION_BUTTON_CLASSES}
    >
      <QuoteActionIcon icon={icon} />
    </button>
  )
}
