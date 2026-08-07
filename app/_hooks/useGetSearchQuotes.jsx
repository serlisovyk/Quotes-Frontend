import { useEffect, useState } from 'react'
import { fetchQuotes } from '@services/services'
import { showApiErrorToast } from '@hooks/apiToast'

export const useGetSearchQuotes = (queryParams, enabled) => {
  const [quotes, setQuotes] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const queryParamsKey = JSON.stringify(queryParams)

  useEffect(() => {
    let ignore = false

    if (!enabled) {
      setQuotes([])
      setTotal(0)
      setIsLoading(false)
      setError(null)
      return
    }

    async function loadQuotes() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchQuotes(JSON.parse(queryParamsKey))

        if (!ignore) {
          setQuotes(data.quotes || [])
          setTotal(data.total || 0)
        }
      } catch (error) {
        if (!ignore) {
          setError(error)
          showApiErrorToast(error)
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadQuotes()

    return () => {
      ignore = true
    }
  }, [enabled, queryParamsKey])

  return { quotes, total, isLoading, error }
}
