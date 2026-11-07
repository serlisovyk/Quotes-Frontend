'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { InputField } from '@/components/input-field'
import { Button } from '@/components/button'
import { createSearchInputFields } from '@/config'
import { createSearchQueryString } from '@/utils/query-string'
import {
  getSearchInputValidationMessage,
  getSearchValidationErrors,
} from '@/utils/validation'
import { BUTTON_GROUP_CLASSES, INITIAL_SEARCH_VALUES, ROUTES } from '@/constants'

export function SearchForm({ initialSearchValues = INITIAL_SEARCH_VALUES }) {
  const router = useRouter()

  const [edit, setEdit] = useState(null)

  const initialForm = {
    searchValues: initialSearchValues,
    validationErrors: {},
    showError: false,
  }
  const isEditCurrent = edit?.source === initialSearchValues
  const { searchValues, validationErrors, showError } = isEditCurrent
    ? edit
    : initialForm

  const updateForm = (changes) =>
    setEdit({
      searchValues,
      validationErrors,
      showError,
      ...changes,
      source: initialSearchValues,
    })

  const handleInputChange = (name, value) => {
    const errorMessage = getSearchInputValidationMessage(name, value)
    const nextValidationErrors = { ...validationErrors, [name]: errorMessage }

    if (!errorMessage) delete nextValidationErrors[name]

    updateForm({
      searchValues: { ...searchValues, [name]: value },
      validationErrors: nextValidationErrors,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const errors = getSearchValidationErrors(searchValues)
    const hasErrors = Object.keys(errors).length > 0

    updateForm({ validationErrors: errors, showError: true })

    if (hasErrors) return

    const query = createSearchQueryString(searchValues)

    router.push(query ? `${ROUTES.SEARCH}?${query}` : ROUTES.SEARCH)
  }

  const handleClear = () => {
    updateForm({
      searchValues: { ...INITIAL_SEARCH_VALUES },
      validationErrors: {},
      showError: false,
    })
    router.push(ROUTES.SEARCH)
  }

  const searchInputFields = createSearchInputFields({
    searchValues,
    validationErrors,
  })

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-6 grid grid-cols-1 gap-4 text-xl lg:grid-cols-[1fr_1fr_1fr_0.35fr_0.35fr]">
        {searchInputFields.map(
          ({ id, name, placeholder, type, min, max, step, value, error }) => (
            <InputField
              key={id}
              id={id}
              name={name}
              placeholder={placeholder}
              type={type}
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
              error={error}
              showError={showError}
            />
          ),
        )}
      </div>

      <div className={`${BUTTON_GROUP_CLASSES} mb-6`}>
        <Button type="submit" text="Search" />
        <Button onClick={handleClear} text="Clear" variant="secondary" />
      </div>
    </form>
  )
}
