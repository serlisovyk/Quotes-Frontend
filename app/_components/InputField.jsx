'use client'

import { useRef, useState } from 'react'

export default function InputField({
  id,
  name = id,
  placeholder,
  value,
  defaultValue = '',
  onChange,
  error,
  showError,
}) {
  const inputRef = useRef(null)
  const hasControlledValue = value !== undefined
  const [innerValue, setInnerValue] = useState(defaultValue)
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
      <div className="relative">
        <label htmlFor={id} className="sr-only">
          {placeholder}
        </label>
        <input
          type="text"
          ref={inputRef}
          id={id}
          name={name}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          aria-invalid={showError && !!error}
          aria-describedby={showError && error ? errorId : undefined}
          className="py-2 pl-3 pr-12 w-full border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 text-gray-800 dark:text-white"
        />
        {currentValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={`Clear ${placeholder}`}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex cursor-pointer items-center text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
        <p id={errorId} className="text-red-500 text-base">
          {error}
        </p>
      )}
    </div>
  )
}