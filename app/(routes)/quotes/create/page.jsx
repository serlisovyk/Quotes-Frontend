import QuoteForm from '@components/QuoteForm'
import { createQuoteAction } from '@actions/quoteActions'
import { INITIAL_FORM_VALUES } from '@config/constants'
import { createInitialQuoteFormState } from '@utils/quoteForm'

export default function CreateQuotePage() {
  return (
    <QuoteForm
      action={createQuoteAction}
      initialState={createInitialQuoteFormState(INITIAL_FORM_VALUES)}
      buttonText="Create"
    />
  )
}
