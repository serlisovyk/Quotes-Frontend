import { Quotes } from '@/components/quotes'
import { SearchForm } from '@/components/search-form'
import { Pagination } from '@/components/pagination'
import { StatusMessage } from '@/components/status-message'
import { fetchQuotesResult } from '@/services/quotes'
import { alignQueryParams } from '@/utils/pagination'
import { createSearchValuesFromSearchParamsObject } from '@/utils/query-string'
import { INITIAL_SEARCH_VALUES, ROUTES } from '@/constants'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Search Quotes',
  description: 'Search quotes by text, author, category, and limit.',
  alternates: {
    canonical: ROUTES.SEARCH,
  },
}

export default async function SearchQuotesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const requestedParams =
    createSearchValuesFromSearchParamsObject(resolvedSearchParams)
  const queryParams = alignQueryParams(requestedParams)
  const searchValues = { ...INITIAL_SEARCH_VALUES, ...queryParams }
  const searchSubmitted = Object.keys(queryParams).length > 0
  const { quotes, total, hasError } = searchSubmitted
    ? await fetchQuotesResult(queryParams)
    : { quotes: [], total: 0, hasError: false }

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-6 text-center">Search Quotes</h1>

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
