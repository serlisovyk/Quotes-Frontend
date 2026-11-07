import {
  EMPTY_FAVORITES,
  FAVORITES_CHANGE_EVENT,
  FAVORITES_STORAGE_KEY,
} from '@/constants'
import { parseFavorites } from '@/utils/parse-favorites'

let pageFavorites = null
let cachedRaw = null
let cachedFavorites = EMPTY_FAVORITES

function writeStoredFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))

    return true
  } catch {
    return false
  }
}

export function readStoredFavorites() {
  if (pageFavorites) return pageFavorites

  let raw = null

  try {
    raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
  } catch {
    return EMPTY_FAVORITES
  }

  if (raw === cachedRaw) return cachedFavorites

  cachedRaw = raw
  cachedFavorites = parseFavorites(raw)

  return cachedFavorites
}

export function saveFavorites(favorites) {
  const isStored = writeStoredFavorites(favorites)

  pageFavorites = isStored ? null : favorites

  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT))
}

export function subscribeToStoredFavorites(onChange) {
  window.addEventListener(FAVORITES_CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)

  return () => {
    window.removeEventListener(FAVORITES_CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}
