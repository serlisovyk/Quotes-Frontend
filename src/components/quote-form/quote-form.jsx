'use client'

import { useActionState, useEffect, useState } from 'react'
import { QuoteFormFields } from '@/components/quote-form-fields'
import { Button } from '@/components/button'
import { BUTTON_GROUP_CLASSES } from '@/constants'

export function QuoteForm(props) {
  const { action, initialState, title, buttonText } = props

  const [actionState, formAction, isPending] = useActionState(action, initialState)
  const [formState, setFormState] = useState(initialState)

  useEffect(() => {
    setFormState(actionState)
  }, [actionState])

  const setValues = (values) => {
    setFormState({
      values,
      errors: {},
      formError: '',
    })
  }

  const handleReset = () => {
    setFormState(initialState)
  }

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
