'use client'

import { useActionState, useState } from 'react'
import { QuoteFormFields } from '@/components/quote-form-fields'
import { Button } from '@/components/button'
import { createInitialQuoteFormState } from '@/utils/quote-form'
import { BUTTON_GROUP_CLASSES } from '@/constants'

export function QuoteForm(props) {
  const { action, initialState, title, buttonText } = props

  const [actionState, formAction, isPending] = useActionState(action, initialState)

  const [edit, setEdit] = useState(null)

  const isEditCurrent = edit?.basedOn === actionState
  const formState = isEditCurrent ? edit.formState : actionState

  const setValues = (values) =>
    setEdit({ formState: createInitialQuoteFormState(values), basedOn: actionState })

  const handleReset = () =>
    setEdit({ formState: initialState, basedOn: actionState })

  return (
    <form action={formAction} className="p-4">
      <h1 className="text-3xl mb-6 text-center dark:text-white">{title}</h1>

      <QuoteFormFields
        values={formState.values}
        setValues={setValues}
        validationErrors={formState.errors}
      />

      {formState.formError && (
        <p className="text-center text-red-500 text-base mb-4">
          {formState.formError}
        </p>
      )}

      <div className={`${BUTTON_GROUP_CLASSES} mb-6`}>
        <Button type="submit" text={buttonText} disabled={isPending} />
        <Button onClick={handleReset} text="Reset" variant="secondary" />
      </div>
    </form>
  )
}
