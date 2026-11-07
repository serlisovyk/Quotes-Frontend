import { notFound } from 'next/navigation'
import { AuthorLink } from '@/components/author-link'
import { Button } from '@/components/button'
import { CategoryTags } from '@/components/category-tags'
import { DeleteQuoteButton } from '@/components/delete-quote-button'
import { QuoteActions } from '@/components/quote-actions'
import { IS_READ_ONLY } from '@/config'
import { fetchQuoteIfExists } from '@/services/quotes'
import { isQuoteValidId } from '@/utils/validation'
import { BUTTON_GROUP_CLASSES, ROUTES } from '@/constants'

export async function generateMetadata({ params }) {
  const { id } = await params

  return {
    title: `Quote #${id}`,
    description: `Read quote #${id} and explore related author and category links.`,
    alternates: {
      canonical: `${ROUTES.QUOTES}/${id}`,
    },
  }
}

export default async function QuotePage({ params }) {
  const { id } = await params

  if (!isQuoteValidId(id)) notFound()

  const quote = await fetchQuoteIfExists(id)

  if (!quote?.id) notFound()

  return (
    <div>
      <div className="max-w-6xl mx-auto p-6 mt-7 bg-panel shadow-lg rounded-lg">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-6 text-accent-text">
          {quote.text}
        </h1>
        <p className="text-2xl text-center text-muted mb-4">
          <AuthorLink author={quote.author} />
        </p>
        <div className="mb-6 flex justify-center">
          <QuoteActions
            id={quote.id}
            text={quote.text}
            author={quote.author}
            categories={quote.categories}
          />
        </div>
        <CategoryTags categories={quote.categories} isSingleQuotePage />
      </div>
      {!IS_READ_ONLY && (
        <div className={`${BUTTON_GROUP_CLASSES} mb-6 items-start`}>
          <Button href={`${ROUTES.QUOTES}/${quote.id}/edit`} text="Edit" />
          <DeleteQuoteButton quoteId={quote.id} />
        </div>
      )}
    </div>
  )
}
