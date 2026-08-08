import Quotes from '@components/Quotes'
import SearchForm from '@components/SearchForm'
import Pagination from '@components/Pagination'
import StatusMessage from '@components/StatusMessage'
import { INITIAL_SEARCH_VALUES } from '@config/constants'
import { fetchQuotesResult } from '@services/services'
import { createSearchValuesFromSearchParamsObject } from '@utils/queryString'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Search Quotes',
  description: 'Search quotes by text, author, category, limit, and offset.',
  alternates: {
    canonical: '/search',
  },
}

export default async function SearchQuotesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const queryParams = createSearchValuesFromSearchParamsObject(resolvedSearchParams)
  const searchValues = { ...INITIAL_SEARCH_VALUES, ...queryParams }
  const searchSubmitted = Object.keys(queryParams).length > 0
  const { quotes, total, hasError } = searchSubmitted
    ? await fetchQuotesResult(queryParams)
    : { quotes: [], total: 0, hasError: false }

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-6 text-center dark:text-white">Search Quotes</h1>

      <SearchForm initialSearchValues={searchValues} />

      {hasError && (
        <StatusMessage text="Error while fetching quotes" className="mb-6" />
      )}

      {quotes.length ? (
        <>
          <Quotes
            quotes={quotes}
            selectedCategory={searchValues.category}
            searchText={searchValues.text}
          />

          <Pagination total={total} queryParams={queryParams} />
        </>
      ) : (
        searchSubmitted &&
        !hasError && (
          <StatusMessage text="No quotes found." size="large" className="pt-10" />
        )
      )}
    </div>
  )
}
