import { API_URL } from '@config/constants'
import { createApiError } from '@services/fetcherErrorsHandler'
import { createSearchQueryString } from '@utils/queryString'

const request = async (method, endpoint, payload = null, queryParams = {}) => {
  const queryString = createSearchQueryString(queryParams)

  const url = queryString
    ? `${API_URL}/${endpoint}?${queryString}`
    : `${API_URL}/${endpoint}`

  const options = {
    method,
    headers: {},
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

const requests = {
  get: (endpoint, queryParams = {}) => request('GET', endpoint, null, queryParams),
  post: (endpoint, payload) => request('POST', endpoint, payload),
  patch: (endpoint, payload) => request('PATCH', endpoint, payload),
  delete: (endpoint) => request('DELETE', endpoint),
}

export default requests
