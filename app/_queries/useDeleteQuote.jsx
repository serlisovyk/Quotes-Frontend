import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteQuote } from '@services/services'

export const useDeleteQuote = (quoteId, onSuccessRedirect) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteQuote(quoteId),
    onSuccess: () => {
      toast.success('Quote was successfully deleted!')
      queryClient.invalidateQueries({ queryKey: ['searchQuotes'] })
      queryClient.invalidateQueries({ queryKey: ['randomQuotes'] })
      setTimeout(onSuccessRedirect, 2000)
    },
  })

  return { deleteQuote: mutate, isPending }
}
