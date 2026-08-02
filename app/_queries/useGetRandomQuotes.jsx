import { useQuery } from '@tanstack/react-query'
import { fetchRandomQuotes } from '@services/services'

export const useGetRandomQuotes = () => {
  const {
    data: quotes = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['randomQuotes'],
    queryFn: fetchRandomQuotes,
    refetchOnWindowFocus: false,
  })

  return { quotes, isLoading: isLoading || isFetching, error, refetch }
}
