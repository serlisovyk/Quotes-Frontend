import { getApiErrorMessages } from '@services/fetcherErrorsHandler'

export const createQuoteFormValuesFromFormData = (formData) => ({
  text: String(formData.get('text') || ''),
  author: String(formData.get('author') || ''),
  categories: String(formData.get('categories') || ''),
})

export const createQuoteActionState = (values, errors = {}, formError = '') => ({
  values,
  errors,
  formError,
})

export const createApiErrorState = (error, values) =>
  createQuoteActionState(
    values,
    error?.fields || {},
    getApiErrorMessages(error).join(' '),
  )

export const createDeleteApiErrorState = (error) => ({
  error: getApiErrorMessages(error).join(' '),
})
