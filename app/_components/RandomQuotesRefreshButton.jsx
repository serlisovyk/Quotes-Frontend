'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import Button from '@components/Button'
import Loader from '@components/Loader'
import Quotes from '@components/Quotes'
import StatusMessage from '@components/StatusMessage'

export default function RandomQuotesRefreshButton({ quotes, hasError }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const refreshQuotes = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <>
      <Button
        onClick={refreshQuotes}
        text={isPending ? 'Loading...' : 'Get Random Quotes'}
        disabled={isPending}
      />

      <div aria-busy={isPending} aria-live="polite" className="min-h-[320px] pt-5">
        {isPending ? (
          <Loader />
        ) : hasError ? (
          <StatusMessage text="Error while fetching random quotes" />
        ) : (
          <Quotes quotes={quotes} />
        )}
      </div>
    </>
  )
}