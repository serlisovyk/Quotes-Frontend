import { QuoteForm } from '@/components/quote-form'
import { createQuoteAction } from '@/actions/quote'
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
  return (
    <QuoteForm
      action={createQuoteAction}
      initialState={createInitialQuoteFormState(INITIAL_FORM_VALUES)}
      buttonText="Create"
    />
  )
}
