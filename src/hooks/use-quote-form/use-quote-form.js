import { useActionState, useState } from 'react'
import { createInitialQuoteFormState } from '@/utils/quote-form'

export function useQuoteForm(action, initialState) {
  const [actionState, formAction, isPending] = useActionState(action, initialState)

  const [formState, setFormState] = useState(actionState)
  const [previousActionState, setPreviousActionState] = useState(actionState)

  if (actionState !== previousActionState) {
    setPreviousActionState(actionState)
    setFormState(actionState)
  }

  const setValues = (values) => setFormState(createInitialQuoteFormState(values))

  const handleReset = () => setFormState(initialState)

  return { formState, formAction, isPending, setValues, handleReset }
}
