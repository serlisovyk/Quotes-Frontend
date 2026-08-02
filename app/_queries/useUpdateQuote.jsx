import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { patchQuote } from '@services/services'

export const useUpdateQuote = (id, onSuccessRedirect) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => patchQuote(id, payload),
    onSuccess: () => {
      toast.success('Quote updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['quote', id] })
      onSuccessRedirect()
    },
  })

  return { updateQuote: mutate, isPending}
}
