'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import QuoteForm from '@components/QuoteForm'
import { INITIAL_FORM_VALUES, ROUTES } from '@config/constants'
import { isQuoteFormValid } from '@utils/validation'
import { useCreateQuote } from '@queries/useCreateQuote'

export default function CreateQuotePage() {
  const router = useRouter()

  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES)
  const [validationErrors, setValidationErrors] = useState({})

  const onSuccessRedirect = (id) => router.push(`${ROUTES.QUOTES}/${id}`)

  const { createQuote, isPending } = useCreateQuote(onSuccessRedirect)

  const handleSubmit = () => {
    if (!isQuoteFormValid({ values: formValues, setValidationErrors })) return

    const { text, author, categories } = formValues

    const payload = {
      text,
      author,
      categories: categories.split(',').map((category) => category.trim()),
    }

    createQuote(payload)
  }

  return (
    <QuoteForm
      values={formValues}
      setValues={setFormValues}
      validationErrors={validationErrors}
      setValidationErrors={setValidationErrors}
      handleSubmit={handleSubmit}
      isLoading={isPending}
      buttonText="Create"
    />
  )
}
