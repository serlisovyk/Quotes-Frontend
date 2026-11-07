import { useSyncExternalStore } from 'react'
import { EMPTY_FAVORITES } from '@/constants'
import {
  readStoredFavorites,
  subscribeToStoredFavorites,
} from '@/utils/favorites-storage'

export function useFavorites() {
  const storedFavorites = useSyncExternalStore(
    subscribeToStoredFavorites,
    readStoredFavorites,
    () => null,
  )

  const isReady = storedFavorites !== null
  const favorites = storedFavorites ?? EMPTY_FAVORITES

  return { favorites, isReady }
}
