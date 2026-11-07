import { useEffect, useState } from 'react'
import { fetchCategorySuggestions } from '@/services/category-suggestions'
import { CATEGORY_SUGGESTIONS_DEBOUNCE_MS } from '@/constants'

export function useCategorySuggestions(query) {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (!query) return

    const controller = new AbortController()

    const loadSuggestions = async () => {
      try {
        const names = await fetchCategorySuggestions(query, controller.signal)

        if (controller.signal.aborted) return

        setSuggestions(names)
      } catch {
        if (controller.signal.aborted) return

        setSuggestions([])
      }
    }

    const timeoutId = setTimeout(loadSuggestions, CATEGORY_SUGGESTIONS_DEBOUNCE_MS)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [query])

  return query ? suggestions : []
}
