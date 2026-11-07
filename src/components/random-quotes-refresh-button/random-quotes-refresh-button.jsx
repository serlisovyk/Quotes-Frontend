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

  const refreshQuotes = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  const renderContent = () => {
    if (isPending) return <Loader />

    if (hasError) return <StatusMessage text="Error while fetching random quotes" />

    return <Quotes quotes={quotes} />
  }

  return (
    <>
      <div className="flex justify-center p-2.5 md:p-5">
        <Button onClick={refreshQuotes} text={buttonText} disabled={isPending} />
      </div>

      <div aria-busy={isPending} aria-live="polite" className="min-h-80 pt-5">
        {renderContent()}
      </div>
    </>
  )
}
