import { QUOTES_API_ENDPOINT } from '@/constants'

export const getSingleQuoteApiEndpoint = (id) => `${QUOTES_API_ENDPOINT}/${id}`
