'use client'

import { Button } from '@/components/button'
import { useDeleteQuoteButton } from '@/hooks/use-delete-quote-button'
import {
  DELETE_DIALOG_BUTTONS_CLASSES,
  DELETE_DIALOG_CLASSES,
  DELETE_DIALOG_CONTENT_CLASSES,
} from '@/constants'

export function DeleteQuoteButton({ quoteId }) {
  const {
    dialogRef,
    titleId,
    error,
    formAction,
    isPending,
    openDialog,
    closeDialog,
    handleDialogClick,
  } = useDeleteQuoteButton(quoteId)

  return (
    <>
      <Button text="Delete" variant="danger" onClick={openDialog} />

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className={DELETE_DIALOG_CLASSES}
        onClick={handleDialogClick}
      >
        <form action={formAction} className={DELETE_DIALOG_CONTENT_CLASSES}>
          <h2 id={titleId} className="text-2xl font-bold">
            Delete this quote?
          </h2>

          <p className="text-muted">
            This action cannot be undone. The quote will be removed permanently.
          </p>

          {error && (
            <p role="alert" className="text-danger-text text-base">
              {error}
            </p>
          )}

          <div className={DELETE_DIALOG_BUTTONS_CLASSES}>
            <Button
              text="Cancel"
              variant="secondary"
              onClick={closeDialog}
              disabled={isPending}
            />

            <Button
              type="submit"
              text={isPending ? 'Deleting...' : 'Delete'}
              variant="danger"
              disabled={isPending}
            />
          </div>
        </form>
      </dialog>
    </>
  )
}
