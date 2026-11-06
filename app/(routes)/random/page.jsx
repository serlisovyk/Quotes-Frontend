import RandomQuotesRefreshButton from '@components/RandomQuotesRefreshButton'
import { fetchRandomQuotesResult } from '@services/services'
import { ROUTES } from '@/constants'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Random Quotes',
  description: 'Browse a fresh set of random quotes with one click.',
  alternates: {
    canonical: ROUTES.RANDOM,
  },
}

export default async function RandomQuotesPage() {
  const { quotes, hasError } = await fetchRandomQuotesResult()

  return (
    <div className="p-4">
      <h1 className="mb-6 text-center text-3xl dark:text-white">Random Quotes</h1>
      <RandomQuotesRefreshButton quotes={quotes} hasError={hasError} />
    </div>
  )
}
