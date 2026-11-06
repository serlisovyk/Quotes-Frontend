import { notFound } from 'next/navigation'
import QuoteForm from '@components/QuoteForm'
import { updateQuoteAction } from '@actions/quoteActions'
import { fetchQuoteIfExists } from '@/services/quotes'
import {
  createInitialQuoteFormState,
  createQuoteFormValues,
} from '@/utils/quote-form'
import { isQuoteValidId } from '@/utils/validation'
import { ROUTES } from '@/constants'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params

  return {
    title: `Edit Quote #${id}`,
    description: `Update quote #${id}, including its text, author, and categories.`,
    alternates: {
      canonical: `${ROUTES.QUOTES}/${id}/edit`,
    },
    robots: {
      index: false,
    },
  }
}

export default async function EditQuotePage({ params }) {
  const { id } = await params

  if (!isQuoteValidId(id)) notFound()

  const quote = await fetchQuoteIfExists(id, { cache: 'no-store' })

  if (!quote?.id) notFound()

  return (
    <QuoteForm
      action={updateQuoteAction.bind(null, id)}
      initialState={createInitialQuoteFormState(createQuoteFormValues(quote))}
      buttonText="Update"
    />
  )
}
