import QuoteForm from '@components/QuoteForm'
import QuoteNotFoundMessage from '@components/QuoteNotFoundMessage'
import { updateQuoteAction } from '@actions/quoteActions'
import { ROUTES } from '@config/constants'
import { fetchQuoteByIdOrNull } from '@services/services'
import {
  createInitialQuoteFormState,
  createQuoteFormValues,
} from '@utils/quoteForm'
import { isQuoteValidId } from '@utils/validation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params

  return {
    title: `Edit Quote #${id}`,
    description: `Update quote #${id}, including its text, author, and categories.`,
    alternates: {
      canonical: `${ROUTES.QUOTES}/${id}/edit`,
    },
  }
}

export default async function EditQuotePage({ params }) {
  const { id } = await params

  if (!isQuoteValidId(id)) {
    return <QuoteNotFoundMessage id={id} />
  }

  const quote = await fetchQuoteByIdOrNull(id)

  if (!quote?.id) {
    return <QuoteNotFoundMessage id={id} />
  }

  return (
    <QuoteForm
      action={updateQuoteAction.bind(null, id)}
      initialState={createInitialQuoteFormState(createQuoteFormValues(quote))}
      buttonText="Update"
    />
  )
}