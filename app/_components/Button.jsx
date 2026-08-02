export default function Button({
  onClick,
  text,
  variant = 'primary',
  disabled = false,
}) {
  const baseClasses =
    'px-6 py-3 text-xl rounded-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-violet-900 text-white focus:ring-violet-600 hover:bg-violet-700',
    secondary: 'bg-gray-300 text-gray-800 focus:ring-blue-500 hover:bg-gray-400',
    danger: 'bg-red-900 text-white focus:ring-red-600 hover:bg-red-700',
  }

  return (
    <div className="text-center m-2.5 md:m-5">
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  )
}
