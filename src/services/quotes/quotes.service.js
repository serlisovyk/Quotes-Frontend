import 'server-only'

import { fetcher } from '@/services/fetcher'
import { ApiError } from '@/errors/api'
import {
  HTTP_STATUS_NOT_FOUND,
  QUOTE_DETAILS_REVALIDATE_SECONDS,
  QUOTES_API_ENDPOINT,
  RANDOM_QUOTES_API_ENDPOINT,
} from '@/constants'
import { getSingleQuoteApiEndpoint } from '@/utils/get-single-quote-api-endpoint'

export const QUOTE_DETAILS_FETCH_OPTIONS = {
  next: {
    revalidate: QUOTE_DETAILS_REVALIDATE_SECONDS,
  },
}

export const fetchQuotes = (queryParams = {}) =>
  fetcher.get(QUOTES_API_ENDPOINT, queryParams, { cache: 'no-store' })

export const fetchQuotesResult = async (queryParams = {}) => {
  try {
    const response = await fetchQuotes(queryParams)

    return {
      quotes: response.quotes || [],
      total: response.total || 0,
      hasError: false,
    }
  } catch {
    return {
      quotes: [],
      total: 0,
      hasError: true,
    }
  }
}

export const fetchRandomQuotes = () =>
  fetcher.get(RANDOM_QUOTES_API_ENDPOINT, {}, { cache: 'no-store' })

export const fetchRandomQuotesResult = async () => {
  try {
    return {
      quotes: await fetchRandomQuotes(),
      hasError: false,
    }
  } catch {
    return {
      quotes: [],
      hasError: true,
    }
  }
}

export const fetchQuoteById = (id, fetchOptions = QUOTE_DETAILS_FETCH_OPTIONS) =>
  fetcher.get(getSingleQuoteApiEndpoint(id), {}, fetchOptions)

export const fetchQuoteByIdOrNull = (id, fetchOptions) =>
  fetchQuoteById(id, fetchOptions).catch(() => null)

export const fetchQuoteIfExists = (id, fetchOptions) =>
  fetchQuoteById(id, fetchOptions).catch((error) => {
    const isNotFound =
      error instanceof ApiError && error.status === HTTP_STATUS_NOT_FOUND

    if (isNotFound) return null

    throw error
  })

export const postQuote = (payload) => fetcher.post(QUOTES_API_ENDPOINT, payload)

export const patchQuote = (id, payload) =>
  fetcher.patch(getSingleQuoteApiEndpoint(id), payload)

export const deleteQuote = (id) => fetcher.delete(getSingleQuoteApiEndpoint(id))
