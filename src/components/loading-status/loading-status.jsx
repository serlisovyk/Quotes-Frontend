import { Loader } from '@/components/loader'

export function LoadingStatus() {
  return (
    <div role="status">
      <span className="sr-only">Loading</span>

      <Loader />
    </div>
  )
}
