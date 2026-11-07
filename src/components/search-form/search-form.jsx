'use client'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/button'
import { createSearchInputFields } from '@/config'
import { useSearchForm } from '@/hooks/use-search-form'
import { BUTTON_GROUP_CLASSES, INITIAL_SEARCH_VALUES } from '@/constants'

export function SearchForm({ initialSearchValues = INITIAL_SEARCH_VALUES }) {
  const {
    searchValues,
    validationErrors,
    showError,
    handleInputChange,
    handleSubmit,
    handleClear,
  } = useSearchForm(initialSearchValues)

  const searchInputFields = createSearchInputFields({
    searchValues,
    validationErrors,
  })

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-6 grid grid-cols-1 gap-4 text-xl lg:grid-cols-[1fr_1fr_1fr_0.5fr]">
        {searchInputFields.map((field) => (
          <FormField
            key={field.id}
            {...field}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            showError={showError}
          />
        ))}
      </div>

      <div className={`${BUTTON_GROUP_CLASSES} mb-6`}>
        <Button type="submit" text="Search" />
        <Button onClick={handleClear} text="Clear" variant="secondary" />
      </div>
    </form>
  )
}
