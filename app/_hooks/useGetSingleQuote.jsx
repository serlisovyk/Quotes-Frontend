import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { fetchQuoteById } from '@services/services'
import { isQuoteValidId } from '@utils/validation'
import { showApiErrorToast } from '@hooks/apiToast'

export const useGetSingleQuote = (id, prepareData) => {
  const [quote, setQuote] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    if (!isQuoteValidId(id)) {
      const error = new Error(
        `Invalid quote ID ${id}. It must be an integer in the range 1..2147483647.`
      )

      toast.error(error.message)
      setQuote({})
      setError(error)
      setIsLoading(false)
      return
    }

    async function loadQuote() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchQuoteById(id)
        const preparedQuote = prepareData ? prepareData(data) : data

        if (!ignore) setQuote(preparedQuote)
      } catch (error) {
        if (!ignore) {
          setQuote({})
          setError(error)
          showApiErrorToast(error)
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadQuote()

    return () => {
      ignore = true
    }
  }, [id, prepareData])

  return { quote, isLoading, error }
}
