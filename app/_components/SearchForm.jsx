'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import InputField from '@components/InputField'
import Button from '@components/Button'
import { createSearchInputFields } from '@/config'
import { INITIAL_SEARCH_VALUES, ROUTES } from '@/constants'
import { createSearchQueryString } from '@utils/queryString'
import { getSearchInputValidationMessage } from '@utils/validation'

export default function SearchFields({
  initialSearchValues = INITIAL_SEARCH_VALUES,
}) {
  const router = useRouter()
  const [searchValues, setSearchValues] = useState(initialSearchValues)
  const [validationErrors, setValidationErrors] = useState({})
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    setSearchValues(initialSearchValues)
    setValidationErrors({})
    setShowError(false)
  }, [initialSearchValues])

  const handleInputChange = (name, value) => {
    setSearchValues({ ...searchValues, [name]: value })

    const errorMessage = getSearchInputValidationMessage(name, value)
    const newValidationErrors = { ...validationErrors }

    if (errorMessage) {
      newValidationErrors[name] = errorMessage
    } else {
      delete newValidationErrors[name]
    }

    setValidationErrors(newValidationErrors)
  }

  const validateSearchValues = () => {
    const errors = Object.entries(searchValues).reduce((acc, [name, value]) => {
      const errorMessage = getSearchInputValidationMessage(name, value)

      if (errorMessage) {
        acc[name] = errorMessage
      }

      return acc
    }, {})

    setValidationErrors(errors)
    return errors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setShowError(true)

    const errors = validateSearchValues()

    if (Object.keys(errors).length) return

    const query = createSearchQueryString(searchValues)
    router.push(query ? `${ROUTES.SEARCH}?${query}` : ROUTES.SEARCH)
  }

  const handleClear = () => {
    setSearchValues({ ...INITIAL_SEARCH_VALUES })
    setValidationErrors({})
    setShowError(false)
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

      <div className="mb-6 flex justify-center">
        <Button type="submit" text="Search" />
        <Button onClick={handleClear} text="Clear" variant="secondary" />
      </div>
    </form>
  )
}
