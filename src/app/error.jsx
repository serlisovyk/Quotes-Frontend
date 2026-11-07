'use client'

import { ErrorScreen } from '@/components/error-screen'
import { useErrorLogging } from '@/hooks/use-error-logging'

export default function ErrorPage({ error, reset }) {
  useErrorLogging(error)

  return <ErrorScreen onRetry={reset} />
}
