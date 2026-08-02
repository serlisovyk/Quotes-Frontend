'use client'

import { useRef } from 'react'

export default function InputField({
  id,
  placeholder,
  value,
  onChange,
  error,
  showError,
}) {
  const inputRef = useRef(null)

  const handleClear = () => {
    onChange({ target: { value: '' } })
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
          placeholder={placeholder}
          value={value ?? ''}
          onChange={onChange}
          className="py-2 pl-3 pr-12 w-full border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 text-gray-800 dark:text-white"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear input field"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
      {showError && error && <p className="text-red-500 text-base">{error}</p>}
    </div>
  )
}
