import InputField from '@components/InputField'
import { createSearchInputFields } from '@config/inputFields'
import { getSearchInputValidationMessage } from '@utils/validation'

export default function SearchFields({
  searchValues,
  setSearchValues,
  validationErrors,
  setValidationErrors,
  showError,
}) {
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

  const searchInputFields = createSearchInputFields({
    searchValues,
    validationErrors,
  })

  return (
    <div className="text-xl grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_0.3fr] gap-4 mb-6">
      {searchInputFields.map(({ id, name, placeholder, value, error }) => (
        <InputField
          key={id}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(name, e.target.value)}
          error={error}
          showError={showError}
        />
      ))}
    </div>
  )
}
