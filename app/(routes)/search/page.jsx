'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import deepEqual from 'deep-equal'
import Button from '@components/Button'
import Quotes from '@components/Quotes'
import Loader from '@components/Loader'
import SearchFields from '@components/SearchForm'
import Pagination from '@components/Pagination'
import { INITIAL_SEARCH_VALUES } from '@config/constants'
import {
  createSearchQueryString,
  createSearchValuesFromQueryString,
} from '@utils/queryString'
import { useGetSearchQuotes } from '@queries/useGetSearchQuotes'

export default function SearchQuotesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchValues, setSearchValues] = useState(INITIAL_SEARCH_VALUES)
  const [searchButtonClicked, setSearchButtonClicked] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [queryParams, setQueryParams] = useState({})
  const [searchSubmitted, setSearchSubmitted] = useState(false)

  useEffect(() => {
    const qsValues = createSearchValuesFromQueryString(searchParams)
    const newValues = { ...INITIAL_SEARCH_VALUES, ...qsValues }

    if (!deepEqual(newValues, searchValues)) {
      setSearchValues(newValues)

      if (Object.keys(qsValues).length === 0) {
        setQueryParams({})
        setSearchSubmitted(false)
      } else {
        setQueryParams(qsValues)
        setSearchSubmitted(true)
      }
    }
  }, [searchParams])

  const isEnabled = searchSubmitted && Object.keys(queryParams).length > 0

  const { quotes, total, isLoading, error } = useGetSearchQuotes(
    queryParams,
    isEnabled
  )

  const handleSearch = () => {
    setSearchButtonClicked(true)
    if (Object.keys(validationErrors).length) return

    const queryParams = { ...searchValues }
    const query = createSearchQueryString(queryParams)
    router.push(`?${query}`)
    setQueryParams(queryParams)
    setSearchSubmitted(true)
  }

  const clearSearch = () => {
    setSearchValues({ ...INITIAL_SEARCH_VALUES })
    setValidationErrors({})
    setSearchButtonClicked(false)
    setSearchSubmitted(false)
    setQueryParams({})
    router.push(window.location.pathname)
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-6 text-center dark:text-white">Search Quotes</h1>

      <SearchFields
        searchValues={searchValues}
        setSearchValues={setSearchValues}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        showError={searchButtonClicked}
      />

      <div className="flex justify-center mb-6">
        <Button onClick={handleSearch} text="Search" />
        <Button onClick={clearSearch} text="Clear" variant="secondary" />
      </div>

      {error && (
        <p className="text-center text-gray-600 mb-6">Error while fetching quotes</p>
      )}

      {isLoading ? (
        <Loader />
      ) : quotes.length ? (
        <>
          <Quotes
            quotes={quotes}
            selectedCategory={searchValues.category}
            searchText={searchValues.text}
          />

          <Pagination
            total={total}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        </>
      ) : (
        searchSubmitted && (
          <p className="text-2xl pt-10 text-center text-gray-600 dark:text-gray-400">
            No quotes found.
          </p>
        )
      )}
    </div>
  )
}
