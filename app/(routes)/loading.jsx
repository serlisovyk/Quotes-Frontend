import Loader from '@components/Loader'

export default function Loading() {
  return (
    <div role="status">
      <span className="sr-only">Loading</span>

      <Loader />
    </div>
  )
}
