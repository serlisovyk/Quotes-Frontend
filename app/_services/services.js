import fetcher from '@services/fetcher'
import { QUOTES_API_ENDPOINT, RANDOM_QUOTES_API_ENDPOINT } from '@config/constants'
import { getSingleQuoteApiEndpoint } from '@utils/utils'

export const fetchQuotes = (queryParams = {}) =>
  fetcher.get(QUOTES_API_ENDPOINT, queryParams)

export const fetchRandomQuotes = () => fetcher.get(RANDOM_QUOTES_API_ENDPOINT)

export const fetchQuoteById = (id) => fetcher.get(getSingleQuoteApiEndpoint(id))

export const postQuote = (payload) => fetcher.post(QUOTES_API_ENDPOINT, payload)

export const patchQuote = (id, payload) =>
  fetcher.patch(getSingleQuoteApiEndpoint(id), payload)

export const deleteQuote = (id) => fetcher.delete(getSingleQuoteApiEndpoint(id))
