import 'server-only'

import { createApiError } from '@/utils/create-api-error'
import { createSearchQueryString } from '@/utils/query-string'
import {
  ALLOWED_API_QUERY_PARAM_NAMES,
  LEADING_SLASHES_PATTERN,
  TRAILING_SLASHES_PATTERN,
} from '@/constants'

const getApiUrl = () => process.env.API_URL

const createUrl = (endpoint, queryParams = {}) => {
  const apiUrl = getApiUrl()

  if (!apiUrl) {
    throw new Error('API_URL environment variable is required.')
  }

  const queryString = createSearchQueryString(
    queryParams,
    ALLOWED_API_QUERY_PARAM_NAMES,
  )

  const baseUrl = apiUrl.replace(TRAILING_SLASHES_PATTERN, '')
  const path = endpoint.replace(LEADING_SLASHES_PATTERN, '')
  const url = `${baseUrl}/${path}`

  return queryString ? `${url}?${queryString}` : url
}

const request = async (
  method,
  endpoint,
  payload = null,
  queryParams = {},
  fetchOptions = {},
) => {
  const url = createUrl(endpoint, queryParams)

  const options = {
    ...fetchOptions,
    method,
    headers: {
      ...(fetchOptions.headers || {}),
    },
  }

  if (method === 'POST' || method === 'PATCH') {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    }
  }

  if (payload) {
    options.body = JSON.stringify(payload)
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    throw await createApiError(response)
  }

  if (method === 'DELETE') {
    return true
  }

  return await response.json()
}

export const fetcher = {
  get: (endpoint, queryParams = {}, fetchOptions = {}) =>
    request('GET', endpoint, null, queryParams, fetchOptions),
  post: (endpoint, payload, fetchOptions = {}) =>
    request('POST', endpoint, payload, {}, fetchOptions),
  patch: (endpoint, payload, fetchOptions = {}) =>
    request('PATCH', endpoint, payload, {}, fetchOptions),
  delete: (endpoint, fetchOptions = {}) =>
    request('DELETE', endpoint, null, {}, fetchOptions),
}
