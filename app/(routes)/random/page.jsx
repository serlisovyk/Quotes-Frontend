'use client'

import Button from '@components/Button'
import Quotes from '@components/Quotes'
import Loader from '@components/Loader'
import { useGetRandomQuotes } from '@queries/useGetRandomQuotes'

export default function RandomQuotesPage() {
  const { quotes, isLoading, error, refetch } = useGetRandomQuotes()

  if (error) {
    return (
      <p className="text-gray-600 text-center">Error while fetching random quotes</p>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-6 text-center dark:text-white">Random Quotes</h1>
      <Button onClick={refetch} text="Get Random Quotes" />
      {isLoading ? <Loader /> : <Quotes quotes={quotes} />}
    </div>
  )
}
