import { FormField } from '@/components/form-field'
import { createQuoteInputFields } from '@/config'

export function QuoteFormFields({ values, setValues, validationErrors }) {
  const quoteInputFields = createQuoteInputFields({
    values,
    setValues,
    validationErrors,
  })

  return (
    <div className="text-xl grid grid-cols-1 gap-4 mx-auto mb-6 md:w-3/4 lg:w-1/2">
      {quoteInputFields.map((field) => (
        <FormField key={field.id} {...field} showError />
      ))}
    </div>
  )
}
