import { useFavorites } from '@/hooks/use-favorites'
import { readStoredFavorites, saveFavorites } from '@/utils/favorites-storage'
import { toggleQuoteInFavorites } from '@/utils/toggle-quote-in-favorites'

export function useFavoriteQuote(quote) {
  const { favorites } = useFavorites()

  const isFavorite = favorites.some(({ id }) => id === quote.id)

  const toggleFavorite = () =>
    saveFavorites(toggleQuoteInFavorites(readStoredFavorites(), quote))

  return { isFavorite, toggleFavorite }
}
