import 'server-only'

import fetcher from '@services/fetcher'
import { QUOTES_API_ENDPOINT, RANDOM_QUOTES_API_ENDPOINT } from '@config/constants'
import { getSingleQuoteApiEndpoint } from '@utils/utils'

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

export const fetchQuoteById = (id) =>
  fetcher.get(getSingleQuoteApiEndpoint(id), {}, { cache: 'no-store' })

export const fetchQuoteByIdOrNull = (id) => fetchQuoteById(id).catch(() => null)

export const postQuote = (payload) => fetcher.post(QUOTES_API_ENDPOINT, payload)

export const patchQuote = (id, payload) =>
  fetcher.patch(getSingleQuoteApiEndpoint(id), payload)

export const deleteQuote = (id) => fetcher.delete(getSingleQuoteApiEndpoint(id))
