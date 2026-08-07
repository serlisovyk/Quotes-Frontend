import { useState } from 'react'
import { toast } from 'react-toastify'
import { deleteQuote as deleteQuoteRequest } from '@services/services'
import { showApiErrorToast } from '@hooks/apiToast'

export const useDeleteQuote = (quoteId, onSuccessRedirect) => {
  const [isPending, setIsPending] = useState(false)

  const deleteQuote = async () => {
    setIsPending(true)

    try {
      await deleteQuoteRequest(quoteId)

      toast.success('Quote was successfully deleted!')
      setTimeout(onSuccessRedirect, 2000)
    } catch (error) {
      showApiErrorToast(error)
    } finally {
      setIsPending(false)
    }
  }

  return { deleteQuote, isPending }
}
