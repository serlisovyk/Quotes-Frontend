'use client'

import { CategorySuggestions } from '@/components/category-suggestions'
import { InputField } from '@/components/input-field'
import { useCategoryField } from '@/hooks/use-category-field'

export function CategoryField(props) {
  const { id, label, value, onChange, isMultiple = false, ...fieldProps } = props

  const {
    options,
    isExpanded,
    activeIndex,
    listboxId,
    activeOptionId,
    handleChange,
    handleKeyDown,
    handleBlur,
    selectOption,
  } = useCategoryField({ id, value, isMultiple, onChange })

  const inputProps = {
    role: 'combobox',
    autoComplete: 'off',
    'aria-autocomplete': 'list',
    'aria-expanded': isExpanded,
    'aria-controls': listboxId,
    'aria-activedescendant': activeOptionId,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
  }

  return (
    <InputField
      {...fieldProps}
      id={id}
      label={label}
      value={value}
      onChange={handleChange}
      inputProps={inputProps}
    >
      <CategorySuggestions
        id={listboxId}
        label={label}
        options={options}
        activeIndex={activeIndex}
        isExpanded={isExpanded}
        onSelect={selectOption}
      />
    </InputField>
  )
}
