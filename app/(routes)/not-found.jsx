import Button from '@components/Button'
import StatusMessage from '@components/StatusMessage'
import { ROUTES } from '@/constants'

export default function NotFound() {
  return (
    <section className="mt-10 flex flex-col items-center">
      <h1 className="mb-4 text-center text-2xl font-bold text-violet-900 md:text-4xl dark:text-violet-300">
        Page not found
      </h1>

      <StatusMessage
        text="The page you are looking for does not exist or has been moved."
        size="large"
      />

      <div className="mt-6">
        <Button href={ROUTES.HOME} text="Go to home page" />
      </div>
    </section>
  )
}
