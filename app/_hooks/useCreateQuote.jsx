import { useState } from 'react'
import { toast } from 'react-toastify'
import { postQuote } from '@services/services'
import { showApiErrorToast } from '@hooks/apiToast'

export const useCreateQuote = (onSuccessRedirect) => {
  const [isPending, setIsPending] = useState(false)

  const createQuote = async (payload) => {
    setIsPending(true)

    try {
      const data = await postQuote(payload)

      toast.success('Quote created successfully!')
      onSuccessRedirect(data.id)
    } catch (error) {
      showApiErrorToast(error)
    } finally {
      setIsPending(false)
    }
  }

  return { createQuote, isPending }
}
