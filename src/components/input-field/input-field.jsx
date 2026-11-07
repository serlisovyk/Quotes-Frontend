'use client'

import { useRef, useState } from 'react'

export function InputField(props) {
  const {
    id,
    name = id,
    label,
    placeholder,
    type = 'text',
    min,
    max,
    step,
    value,
    defaultValue = '',
    onChange,
    error,
    showError,
  } = props

  const inputRef = useRef(null)

  const [innerValue, setInnerValue] = useState(defaultValue)

  const hasControlledValue = value !== undefined
  const errorId = `${id}-error`
  const currentValue = hasControlledValue ? (value ?? '') : innerValue

  const handleChange = (event) => {
    if (!hasControlledValue) {
      setInnerValue(event.target.value)
    }

    onChange?.(event)
  }

  const handleClear = () => {
    if (!hasControlledValue) {
      setInnerValue('')
    }

    onChange?.({ target: { value: '' } })
    inputRef.current?.focus()
  }

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1 block text-base text-body">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          ref={inputRef}
          id={id}
          name={name}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          aria-invalid={showError && !!error}
          aria-describedby={showError && error ? errorId : undefined}
          className="w-full rounded border border-line bg-panel py-2 pr-12 pl-3 text-body placeholder:text-muted focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
        />
        {currentValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={`Clear ${label}`}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex cursor-pointer items-center text-muted transition-colors duration-fast hover:text-body focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        )}
      </div>
      {showError && error && (
        <p id={errorId} className="text-danger-text text-base">
          {error}
        </p>
      )}
    </div>
  )
}
