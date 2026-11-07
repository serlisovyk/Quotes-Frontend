import { useActionState, useId, useRef } from 'react'
import { deleteQuoteAction } from '@/actions/quote'
import { INITIAL_DELETE_STATE } from '@/constants'

export function useDeleteQuoteButton(quoteId) {
  const dialogRef = useRef(null)
  const titleId = useId()

  const [state, formAction, isPending] = useActionState(
    deleteQuoteAction.bind(null, quoteId),
    INITIAL_DELETE_STATE,
  )

  const openDialog = () => dialogRef.current.showModal()

  const closeDialog = () => dialogRef.current.close()

  const handleDialogClick = (event) => {
    if (event.target === event.currentTarget) closeDialog()
  }

  return {
    dialogRef,
    titleId,
    error: state?.error,
    formAction,
    isPending,
    openDialog,
    closeDialog,
    handleDialogClick,
  }
}
