import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { fetchQuoteById } from '@services/services'
import { isQuoteValidId } from '@utils/validation'

export const useGetSingleQuote = (id, prepareData) => {
  const isValid = isQuoteValidId(id)

  if (!isValid) {
    toast.error(
      `Invalid quote ID ${id}. It must be an integer in the range 1..2147483647.`
    )
  }

  const {
    data: quote = {},
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['quote', id],
    queryFn: () => fetchQuoteById(id),
    select: prepareData,
    enabled: isValid,
    refetchOnWindowFocus: false,
  })

  return { quote, isLoading: isLoading || isFetching, error }
}
