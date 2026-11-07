'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/button'
import { Loader } from '@/components/loader'
import { Quotes } from '@/components/quotes'
import { StatusMessage } from '@/components/status-message'

export function RandomQuotesRefreshButton({ quotes, hasError }) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const buttonText = isPending ? 'Loading...' : 'Get Random Quotes'
  const contentClasses = isPending
    ? 'opacity-50 transition-opacity duration-fast'
    : 'transition-opacity duration-fast'

  const refreshQuotes = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <>
      <div className="flex justify-center p-2.5 md:p-5">
        <Button onClick={refreshQuotes} text={buttonText} disabled={isPending} />
      </div>

      <div
        aria-busy={isPending}
        aria-live="polite"
        className="relative min-h-80 pt-5"
      >
        <div className={contentClasses}>
          {hasError ? (
            <StatusMessage text="Error while fetching random quotes" />
          ) : (
            <Quotes quotes={quotes} />
          )}
        </div>

        {isPending && (
          <div className="absolute inset-x-0 top-0 flex justify-center">
            <Loader />
          </div>
        )}
      </div>
    </>
  )
}
