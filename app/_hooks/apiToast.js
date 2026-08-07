import { toast } from 'react-toastify'
import { getApiErrorMessages } from '@services/fetcherErrorsHandler'

export function showApiErrorToast(error) {
  getApiErrorMessages(error).forEach((message) => toast.error(message))
}
