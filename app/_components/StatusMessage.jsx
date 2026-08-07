export default function StatusMessage({ text, size = 'base', className = '' }) {
  const sizeClasses = {
    base: 'text-base',
    large: 'text-2xl',
  }

  return (
    <p
      className={`text-center text-gray-600 dark:text-gray-400 ${sizeClasses[size]} ${className}`.trim()}
    >
      {text}
    </p>
  )
}
