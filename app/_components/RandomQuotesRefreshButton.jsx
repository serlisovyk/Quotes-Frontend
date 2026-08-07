'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import Button from '@components/Button'

export default function RandomQuotesRefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const refreshQuotes = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <Button
      onClick={refreshQuotes}
      text={isPending ? 'Loading...' : 'Get Random Quotes'}
      disabled={isPending}
    />
  )
}
