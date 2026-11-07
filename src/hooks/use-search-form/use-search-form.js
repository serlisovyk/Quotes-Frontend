import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createSearchQueryString } from '@/utils/query-string'
import {
  getSearchInputValidationMessage,
  getSearchValidationErrors,
} from '@/utils/validation'
import { INITIAL_SEARCH_VALUES, ROUTES } from '@/constants'

const createFormState = (searchValues) => ({
  searchValues,
  validationErrors: {},
  showError: false,
})

export function useSearchForm(initialSearchValues) {
  const router = useRouter()

  const [formState, setFormState] = useState(createFormState(initialSearchValues))
  const [previousInitialValues, setPreviousInitialValues] =
    useState(initialSearchValues)

  if (initialSearchValues !== previousInitialValues) {
    setPreviousInitialValues(initialSearchValues)
    setFormState(createFormState(initialSearchValues))
  }

  const { searchValues, validationErrors, showError } = formState

  const updateFormState = (changes) => setFormState({ ...formState, ...changes })

  const handleInputChange = (name, value) => {
    const errorMessage = getSearchInputValidationMessage(name, value)
    const nextValidationErrors = { ...validationErrors, [name]: errorMessage }

    if (!errorMessage) delete nextValidationErrors[name]

    updateFormState({
      searchValues: { ...searchValues, [name]: value },
      validationErrors: nextValidationErrors,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const errors = getSearchValidationErrors(searchValues)
    const hasErrors = Object.keys(errors).length > 0

    updateFormState({ validationErrors: errors, showError: true })

    if (hasErrors) return

    const query = createSearchQueryString(searchValues)

    router.push(query ? `${ROUTES.SEARCH}?${query}` : ROUTES.SEARCH)
  }

  const handleClear = () => {
    setFormState(createFormState({ ...INITIAL_SEARCH_VALUES }))
    router.push(ROUTES.SEARCH)
  }

  return {
    searchValues,
    validationErrors,
    showError,
    handleInputChange,
    handleSubmit,
    handleClear,
  }
}
