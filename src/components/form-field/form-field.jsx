import { InputField } from '@/components/input-field'
import { SelectField } from '@/components/select-field'

export function FormField(props) {
  const { control, ...fieldProps } = props

  if (control === 'select') return <SelectField {...fieldProps} />

  return <InputField {...fieldProps} />
}
