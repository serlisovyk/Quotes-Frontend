import { useState } from 'react'
import { useCategorySuggestions } from '@/hooks/use-category-suggestions'
import {
  getCategorySuggestionQuery,
  replaceCategoryToken,
} from '@/utils/category-token'
import { getNextOptionIndex } from '@/utils/get-next-option-index'
import {
  KEYBOARD_KEY,
  NO_ACTIVE_OPTION,
  OPTION_STEP_DOWN,
  OPTION_STEP_UP,
} from '@/constants'

export function useCategoryField(props) {
  const { id, value, isMultiple, onChange } = props

  const listboxId = `${id}-suggestions`

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(NO_ACTIVE_OPTION)

  const query = getCategorySuggestionQuery(value, isMultiple)
  const suggestions = useCategorySuggestions(query)
  const options = suggestions.map((name) => ({ name, id: `${listboxId}-${name}` }))
  const isExpanded = isOpen && options.length > 0
  const activeOption = options[activeIndex]
  const activeOptionId = isExpanded ? activeOption?.id : undefined

  const close = () => {
    setIsOpen(false)
    setActiveIndex(NO_ACTIVE_OPTION)
  }

  const selectOption = (name) => {
    onChange({ target: { value: replaceCategoryToken(value, name, isMultiple) } })
    close()
  }

  const moveActiveOption = (step) => {
    if (!isExpanded) {
      setIsOpen(true)
      return
    }

    setActiveIndex(getNextOptionIndex(activeIndex, options.length, step))
  }

  const handleChange = (event) => {
    onChange(event)
    setIsOpen(true)
    setActiveIndex(NO_ACTIVE_OPTION)
  }

  const handleKeyDown = (event) => {
    const hasOptions = options.length > 0

    if (event.key === KEYBOARD_KEY.ARROW_DOWN && hasOptions) {
      event.preventDefault()
      moveActiveOption(OPTION_STEP_DOWN)
    }

    if (event.key === KEYBOARD_KEY.ARROW_UP && hasOptions) {
      event.preventDefault()
      moveActiveOption(OPTION_STEP_UP)
    }

    if (event.key === KEYBOARD_KEY.ENTER && isExpanded && activeOption) {
      event.preventDefault()
      selectOption(activeOption.name)
    }

    if (event.key === KEYBOARD_KEY.ESCAPE && isExpanded) {
      event.preventDefault()
      close()
    }
  }

  return {
    options,
    isExpanded,
    activeIndex,
    listboxId,
    activeOptionId,
    handleChange,
    handleKeyDown,
    handleBlur: close,
    selectOption,
  }
}
