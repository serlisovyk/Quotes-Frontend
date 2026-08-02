'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import QuoteForm from '@components/QuoteForm'
import Loader from '@components/Loader'
import { INITIAL_FORM_VALUES, ROUTES } from '@config/constants'
import { isQuoteFormValid } from '@utils/validation'
import { useUpdateQuote } from '@queries/useUpdateQuote'
import { useGetSingleQuote } from '@queries/useGetSingleQuote'

export default function EditQuotePage({ params: { id } }) {
  const router = useRouter()

  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES)
  const [validationErrors, setValidationErrors] = useState({})

  const formatFormValues = ({ text, author, categories }) => ({
    text,
    author,
    categories: categories.join(', '),
  })

  const { quote, isLoading } = useGetSingleQuote(id, formatFormValues)

  useEffect(() => {
    if (quote) setFormValues(quote)
  }, [quote])

  const onSuccessRedirect = () => router.push(`${ROUTES.QUOTES}/${id}`)

  const { updateQuote, isPending } = useUpdateQuote(id, onSuccessRedirect)

  const handleSubmit = () => {
    if (!isQuoteFormValid({ values: formValues, setValidationErrors })) return

    const { text, author, categories } = formValues

    const payload = {
      text,
      author,
      categories: categories.split(',').map((category) => category.trim()),
    }

    updateQuote(payload)
  }

  if (isLoading) return <Loader isFullHeight={true} />

  return (
    <QuoteForm
      values={formValues}
      setValues={setFormValues}
      validationErrors={validationErrors}
      setValidationErrors={setValidationErrors}
      handleSubmit={handleSubmit}
      isLoading={isPending}
      buttonText="Update"
    />
  )
}
