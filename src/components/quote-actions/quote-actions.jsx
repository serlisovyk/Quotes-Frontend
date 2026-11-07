'use client'

import { QuoteActionButton } from '@/components/quote-action-button'
import { useQuoteActions } from '@/hooks/use-quote-actions'
import {
  QUOTE_ACTION_ICONS,
  QUOTE_ACTION_LABELS,
  QUOTE_ACTIONS_CLASSES,
} from '@/constants'

export function QuoteActions({ id, text, author }) {
  const { copyQuote, shareQuote } = useQuoteActions({ id, text, author })

  const actions = [
    {
      label: QUOTE_ACTION_LABELS.COPY,
      icon: QUOTE_ACTION_ICONS.COPY,
      onClick: copyQuote,
    },
    {
      label: QUOTE_ACTION_LABELS.SHARE,
      icon: QUOTE_ACTION_ICONS.SHARE,
      onClick: shareQuote,
    },
  ]

  return (
    <div className={QUOTE_ACTIONS_CLASSES}>
      {actions.map(({ label, icon, onClick }) => (
        <QuoteActionButton key={label} label={label} icon={icon} onClick={onClick} />
      ))}
    </div>
  )
}
