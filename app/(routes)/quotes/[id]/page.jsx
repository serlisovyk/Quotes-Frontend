import Link from 'next/link'
import { notFound } from 'next/navigation'
import Button from '@components/Button'
import CategoryTags from '@components/CategoryTags'
import DeleteQuoteButton from '@components/DeleteQuoteButton'
import { fetchQuoteIfExists } from '@/services/quotes'
import { createSearchQueryString } from '@/utils/query-string'
import { isQuoteValidId } from '@/utils/validation'
import { ROUTES } from '@/constants'

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
      <div className="max-w-6xl mx-auto p-6 mt-7 bg-white shadow-lg rounded-lg dark:bg-gray-800">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-6 text-violet-900 dark:text-violet-300">
          {quote.text}
        </h1>
        <p className="text-2xl text-center text-gray-600 dark:text-gray-300 mb-10">
          <Link
            href={`${ROUTES.SEARCH}?${createSearchQueryString({ author: quote.author })}`}
          >
            -{' '}
            <span className="hover:underline hover:text-blue-600 hover:dark:text-blue-300">
              {quote.author}
            </span>
          </Link>
        </p>
        <CategoryTags categories={quote.categories} isSingleQuotePage={true} />
      </div>
      <div className="flex justify-center mb-6">
        <Button href={`${ROUTES.QUOTES}/${quote.id}/edit`} text="Edit" />
        <DeleteQuoteButton quoteId={quote.id} />
      </div>
    </div>
  )
}
