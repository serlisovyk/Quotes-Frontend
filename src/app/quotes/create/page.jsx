import { notFound } from 'next/navigation'
import { QuoteForm } from '@/components/quote-form'
import { createQuoteAction } from '@/actions/quote'
import { IS_READ_ONLY } from '@/config'
import { createInitialQuoteFormState } from '@/utils/quote-form'
import { INITIAL_FORM_VALUES, ROUTES } from '@/constants'

export const metadata = {
  title: 'Create Quote',
  description: 'Create a new quote with author and category details.',
  alternates: {
    canonical: ROUTES.CREATE,
  },
  robots: {
    index: false,
  },
}

export default function CreateQuotePage() {
  if (IS_READ_ONLY) notFound()

  return (
    <QuoteForm
      action={createQuoteAction}
      initialState={createInitialQuoteFormState(INITIAL_FORM_VALUES)}
      title="Create New Quote"
      buttonText="Create"
    />
  )
}
