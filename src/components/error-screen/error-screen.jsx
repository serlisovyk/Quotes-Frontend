import { Button } from '@/components/button'
import { StatusMessage } from '@/components/status-message'
import {
  ERROR_SCREEN_RETRY_TEXT,
  ERROR_SCREEN_TEXT,
  ERROR_SCREEN_TITLE,
} from '@/constants'

export function ErrorScreen({ onRetry }) {
  return (
    <section className="mt-10 flex flex-col items-center">
      <h1 className="mb-4 text-center text-2xl font-bold text-accent-text md:text-4xl">
        {ERROR_SCREEN_TITLE}
      </h1>

      <StatusMessage text={ERROR_SCREEN_TEXT} size="large" />

      <div className="mt-8 md:mt-11">
        <Button onClick={onRetry} text={ERROR_SCREEN_RETRY_TEXT} />
      </div>
    </section>
  )
}
