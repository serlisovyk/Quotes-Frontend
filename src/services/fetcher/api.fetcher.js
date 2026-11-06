import 'server-only'

import { createApiError } from '@/utils/create-api-error'
import { createSearchQueryString } from '@/utils/query-string'

const getApiUrl = () => process.env.API_URL

const createUrl = (endpoint, queryParams = {}) => {
  const apiUrl = getApiUrl()

  if (!apiUrl) {
    throw new Error('API_URL environment variable is required.')
  }

  const queryString = createSearchQueryString(queryParams)

  return queryString
    ? `${apiUrl}/${endpoint}?${queryString}`
    : `${apiUrl}/${endpoint}`
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
