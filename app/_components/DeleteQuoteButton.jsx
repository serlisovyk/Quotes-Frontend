'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import Button from '@components/Button'
import { deleteQuoteAction } from '@actions/quoteActions'

const initialState = {
  error: '',
}

export default function DeleteQuoteButton({ quoteId }) {
  const [state, formAction, isPending] = useActionState(
    deleteQuoteAction.bind(null, quoteId),
    initialState,
  )

  useEffect(() => {
    if (!state?.error) return

    toast.error(state.error, { id: `delete-quote-error-${quoteId}` })
  }, [quoteId, state?.error])

  return (
    <form action={formAction}>
      <Button
        type="submit"
        text={isPending ? 'Deleting...' : 'Delete'}
        variant="danger"
        disabled={isPending}
      />

      {state?.error && (
        <p className="text-center text-red-500 text-base">{state.error}</p>
      )}
    </form>
  )
}
