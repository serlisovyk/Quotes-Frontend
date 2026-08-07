import { useCallback, useEffect, useState } from 'react'
import { fetchRandomQuotes } from '@services/services'
import { showApiErrorToast } from '@hooks/apiToast'

export const useGetRandomQuotes = () => {
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchRandomQuotes()
      setQuotes(data)
    } catch (error) {
      setError(error)
      showApiErrorToast(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { quotes, isLoading, error, refetch }
}
