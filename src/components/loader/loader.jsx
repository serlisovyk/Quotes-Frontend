export function Loader({ isFullHeight = false }) {
  const heightClasses = isFullHeight ? 'h-screen' : 'mt-5'

  return (
    <div className={`flex ${heightClasses} items-center justify-center`}>
      <div
        aria-hidden="true"
        className="size-15 animate-spin rounded-full border-4 border-surface border-t-accent-text motion-reduce:animate-pulse"
      />
    </div>
  )
}
