'use client'

import { ErrorScreen } from '@/components/error-screen'
import { useErrorLogging } from '@/hooks/use-error-logging'
import { getThemeInitScript } from '@/utils/get-theme-init-script'
import { ERROR_SCREEN_TITLE, GLOBAL_ERROR_BODY_CLASS_NAME } from '@/constants'
import './globals.css'

export default function GlobalError({ error, reset }) {
  useErrorLogging(error)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{ERROR_SCREEN_TITLE}</title>

        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>

      <body className={GLOBAL_ERROR_BODY_CLASS_NAME}>
        <main className="container mx-auto flex-1 p-4">
          <ErrorScreen onRetry={reset} />
        </main>
      </body>
    </html>
  )
}
