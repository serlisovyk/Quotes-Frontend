'use client'

import { Button } from '@/components/button'
import { Quotes } from '@/components/quotes'
import { StatusMessage } from '@/components/status-message'
import { useFavorites } from '@/hooks/use-favorites'
import {
  FAVORITES_EMPTY_CLASSES,
  FAVORITES_EMPTY_MESSAGE,
  FAVORITES_SEARCH_LINK_TEXT,
  ROUTES,
} from '@/constants'

export function FavoriteQuotes() {
  const { favorites, isReady } = useFavorites()

  if (!isReady) return null

  if (favorites.length === 0) {
    return (
      <div className={FAVORITES_EMPTY_CLASSES}>
        <StatusMessage text={FAVORITES_EMPTY_MESSAGE} size="large" />

        <Button href={ROUTES.SEARCH} text={FAVORITES_SEARCH_LINK_TEXT} />
      </div>
    )
  }

  return <Quotes quotes={favorites} />
}
