import Quotes from '@components/Quotes'
import RandomQuotesRefreshButton from '@components/RandomQuotesRefreshButton'
import StatusMessage from '@components/StatusMessage'
import { fetchRandomQuotesResult } from '@services/services'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Random Quotes',
  description: 'Browse a fresh set of random quotes with one click.',
  alternates: {
    canonical: '/random',
  },
}

export default async function RandomQuotesPage() {
  const { quotes, hasError } = await fetchRandomQuotesResult()

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-6 text-center dark:text-white">Random Quotes</h1>

      <RandomQuotesRefreshButton />

      {hasError ? (
        <StatusMessage text="Error while fetching random quotes" />
      ) : (
        <Quotes quotes={quotes} />
      )}
    </div>
  )
}
