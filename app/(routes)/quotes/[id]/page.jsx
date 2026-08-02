'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@components/Button'
import CategoryTags from '@components/CategoryTags'
import Loader from '@components/Loader'
import { ROUTES } from '@config/constants'
import { useDeleteQuote } from '@queries/useDeleteQuote'
import { useGetSingleQuote } from '@queries/useGetSingleQuote'

export default function QuotePage({ params: { id } }) {
  const router = useRouter()

  const { quote, isLoading } = useGetSingleQuote(id)

  const onSuccessRedirect = () => router.push(ROUTES.HOME)

  const { deleteQuote, isPending } = useDeleteQuote(id, onSuccessRedirect)

  if (isLoading) return <Loader isFullHeight={true} />

  if (!quote.id) {
    return (
      <p className="text-center text-2xl mt-10">{`Quote with id ${id} not found.`}</p>
    )
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto p-6 mt-7 bg-white shadow-lg rounded-lg dark:bg-gray-800">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-violet-900 dark:text-violet-300">
          {quote.text}
        </h2>
        <p className="text-2xl text-center text-gray-600 dark:text-gray-300 mb-10">
          <Link href={`/search?author=${quote.author}`}>
            —{' '}
            <span className="hover:underline hover:text-blue-600 hover:dark:text-blue-300">
              {quote.author}
            </span>
          </Link>
        </p>
        <CategoryTags categories={quote.categories} isSingleQuotePage={true} />
      </div>
      <div className="flex justify-center mb-6">
        <Link href={`/quotes/${quote.id}/edit`}>
          <Button text="Edit" variant="primary" />
        </Link>
        <Button
          onClick={deleteQuote}
          text="Delete"
          variant="danger"
          disabled={isPending}
        />
      </div>
    </div>
  )
}
