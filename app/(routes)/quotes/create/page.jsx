import QuoteForm from '@components/QuoteForm'
import { createQuoteAction } from '@actions/quoteActions'
import { INITIAL_FORM_VALUES } from '@config/constants'
import { createInitialQuoteFormState } from '@utils/quoteForm'

export const metadata = {
  title: 'Create Quote',
  description: 'Create a new quote with author and category details.',
  alternates: {
    canonical: '/quotes/create',
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
