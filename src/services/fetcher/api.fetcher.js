import 'server-only'

import { createApiError } from '@/utils/create-api-error'
import {
  API_REQUEST_TIMEOUT_MS,
  LEADING_SLASHES_PATTERN,
  TRAILING_SLASHES_PATTERN,
} from '@/constants'

const getApiUrl = () => process.env.API_URL

const createUrl = (endpoint, queryString = '') => {
  const apiUrl = getApiUrl()

  if (!apiUrl) {
    throw new Error('API_URL environment variable is required.')
  }

  const baseUrl = apiUrl.replace(TRAILING_SLASHES_PATTERN, '')
  const path = endpoint.replace(LEADING_SLASHES_PATTERN, '')
  const url = `${baseUrl}/${path}`

  return queryString ? `${url}?${queryString}` : url
}

const createRequestSignal = (callerSignal) => {
  const timeoutSignal = AbortSignal.timeout(API_REQUEST_TIMEOUT_MS)

  if (!callerSignal) return timeoutSignal

  return AbortSignal.any([callerSignal, timeoutSignal])
}

const request = async (
  method,
  endpoint,
  payload = null,
  queryString = '',
  fetchOptions = {},
) => {
  const url = createUrl(endpoint, queryString)

  const options = {
    ...fetchOptions,
    method,
    signal: createRequestSignal(fetchOptions.signal),
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
  get: (endpoint, queryString = '', fetchOptions = {}) =>
    request('GET', endpoint, null, queryString, fetchOptions),
  post: (endpoint, payload, fetchOptions = {}) =>
    request('POST', endpoint, payload, '', fetchOptions),
  patch: (endpoint, payload, fetchOptions = {}) =>
    request('PATCH', endpoint, payload, '', fetchOptions),
  delete: (endpoint, fetchOptions = {}) =>
    request('DELETE', endpoint, null, '', fetchOptions),
}
