import { useState } from 'react'
import { toast } from 'react-toastify'
import { patchQuote } from '@services/services'
import { showApiErrorToast } from '@hooks/apiToast'

export const useUpdateQuote = (id, onSuccessRedirect) => {
  const [isPending, setIsPending] = useState(false)

  const updateQuote = async (payload) => {
    setIsPending(true)

    try {
      await patchQuote(id, payload)

      toast.success('Quote updated successfully!')
      onSuccessRedirect()
    } catch (error) {
      showApiErrorToast(error)
    } finally {
      setIsPending(false)
    }
  }

  return { updateQuote, isPending }
}
