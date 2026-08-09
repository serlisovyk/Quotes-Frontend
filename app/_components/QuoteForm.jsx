'use client'

import { useActionState, useEffect, useState } from 'react'
import QuoteFormFields from '@components/QuoteFormFields'
import Button from '@components/Button'

export default function QuoteForm({ action, initialState, buttonText }) {
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
      <h1 className="text-3xl mb-6 text-center dark:text-white">
        {buttonText === 'Create' ? 'Create New Quote' : 'Edit Quote'}
      </h1>
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

      <div className="flex justify-center gap-4 mb-6">
        <Button type="submit" text={buttonText} disabled={isPending} />
        <Button onClick={handleReset} text="Reset" variant="secondary" />
      </div>
    </form>
  )
}
