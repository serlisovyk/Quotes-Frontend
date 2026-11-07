import {
  FIELD_ERROR_CLASSES,
  FIELD_LABEL_CLASSES,
  FIELD_SELECT_CLASSES,
} from '@/constants'

export function SelectField(props) {
  const { id, name = id, label, options, value, onChange, error, showError } = props

  const errorId = `${id}-error`
  const hasShownError = showError && !!error

  return (
    <div className="w-full">
      <label htmlFor={id} className={FIELD_LABEL_CLASSES}>
        {label}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={hasShownError}
        aria-describedby={hasShownError ? errorId : undefined}
        className={FIELD_SELECT_CLASSES}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {hasShownError && (
        <p id={errorId} className={FIELD_ERROR_CLASSES}>
          {error}
        </p>
      )}
    </div>
  )
}
