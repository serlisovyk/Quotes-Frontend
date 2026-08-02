import QuoteFormFields from '@components/QuoteFormFields'
import Button from '@components/Button'
import { INITIAL_FORM_VALUES } from '@config/constants'

export default function QuoteForm({
  values,
  setValues,
  validationErrors,
  setValidationErrors,
  handleSubmit,
  isLoading,
  buttonText,
}) {
  const handleReset = () => {
    setValues(INITIAL_FORM_VALUES)
    setValidationErrors({})
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-6 text-center dark:text-white">
        {buttonText === 'Create' ? 'Create New Quote' : 'Edit Quote'}
      </h1>
      <QuoteFormFields
        values={values}
        setValues={setValues}
        validationErrors={validationErrors}
      />
      <div className="flex justify-center gap-4 mb-6">
        <Button onClick={handleSubmit} text={buttonText} disabled={isLoading} />
        <Button onClick={handleReset} text="Reset" variant="secondary" />
      </div>
    </div>
  )
}
