import { CategoryField } from '@/components/category-field'
import { InputField } from '@/components/input-field'
import { SelectField } from '@/components/select-field'

export function FormField(props) {
  const { control, ...fieldProps } = props

  if (control === 'select') return <SelectField {...fieldProps} />

  if (control === 'category') return <CategoryField {...fieldProps} />

  return <InputField {...fieldProps} />
}
