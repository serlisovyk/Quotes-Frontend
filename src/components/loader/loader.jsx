export function Loader({ isFullHeight = false }) {
  const heightClasses = isFullHeight ? 'h-screen' : 'mt-5'

  return (
    <div className={`flex ${heightClasses} items-center justify-center`}>
      <div
        aria-hidden="true"
        className="size-15 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500 motion-reduce:animate-pulse dark:border-gray-600 dark:border-t-blue-400"
      />
    </div>
  )
}
