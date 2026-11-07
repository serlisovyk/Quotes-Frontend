'use client'

import { useActionState } from 'react'
import { Button } from '@/components/button'
import { deleteQuoteAction } from '@/actions/quote'
import { INITIAL_DELETE_STATE } from '@/constants'

export function DeleteQuoteButton({ quoteId }) {
  const [state, formAction, isPending] = useActionState(
    deleteQuoteAction.bind(null, quoteId),
    INITIAL_DELETE_STATE,
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
        <p role="alert" className="text-center text-danger-text text-base">
          {state.error}
        </p>
      )}
    </form>
  )
}
