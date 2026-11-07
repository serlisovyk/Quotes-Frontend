'use client'

import { ErrorScreen } from '@/components/error-screen'
import { useErrorLogging } from '@/hooks/use-error-logging'
import { useTheme } from '@/hooks/use-theme'
import { ERROR_SCREEN_TITLE, GLOBAL_ERROR_BODY_CLASS_NAME } from '@/constants'
import './globals.css'

export default function GlobalError({ error, reset }) {
  useTheme()

  useErrorLogging(error)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{ERROR_SCREEN_TITLE}</title>
      </head>

      <body className={GLOBAL_ERROR_BODY_CLASS_NAME}>
        <main className="container mx-auto flex-1 p-4">
          <ErrorScreen onRetry={reset} />
        </main>
      </body>
    </html>
  )
}
