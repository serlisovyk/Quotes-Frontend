import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { postQuote } from '@services/services'

export const useCreateQuote = (onSuccessRedirect) => {
  const { mutate, isPending } = useMutation({
    mutationFn: postQuote,
    onSuccess: (data) => {
      toast.success('Quote created successfully!')
      onSuccessRedirect(data.id)
    },
  })

  return { createQuote: mutate, isPending }
}
