'use client'

import { useActionState } from 'react'
import Button from '@components/Button'
import { deleteQuoteAction } from '@/actions/quote'

const initialState = {
  error: '',
}

export default function DeleteQuoteButton({ quoteId }) {
  const [state, formAction, isPending] = useActionState(
    deleteQuoteAction.bind(null, quoteId),
    initialState,
  )

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
