'use client'

import { QuoteActionButton } from '@/components/quote-action-button'
import { useFavoriteQuote } from '@/hooks/use-favorite-quote'
import { useQuoteActions } from '@/hooks/use-quote-actions'
import {
  QUOTE_ACTION_ICONS,
  QUOTE_ACTION_LABELS,
  QUOTE_ACTIONS_CLASSES,
} from '@/constants'

export function QuoteActions({ id, text, author, categories }) {
  const quote = { id, text, author, categories }

  const { copyQuote, shareQuote } = useQuoteActions(quote)
  const { isFavorite, toggleFavorite } = useFavoriteQuote(quote)

  const favoriteLabel = isFavorite
    ? QUOTE_ACTION_LABELS.REMOVE_FAVORITE
    : QUOTE_ACTION_LABELS.ADD_FAVORITE

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
    {
      label: favoriteLabel,
      icon: QUOTE_ACTION_ICONS.FAVORITE,
      isPressed: isFavorite,
      onClick: toggleFavorite,
    },
  ]

  return (
    <div className={QUOTE_ACTIONS_CLASSES}>
      {actions.map(({ label, icon, isPressed, onClick }) => (
        <QuoteActionButton
          key={icon}
          label={label}
          icon={icon}
          isPressed={isPressed}
          onClick={onClick}
        />
      ))}
    </div>
  )
}
