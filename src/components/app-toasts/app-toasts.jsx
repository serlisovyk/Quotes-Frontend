'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import { useTheme } from '@/hooks/use-theme'
import {
  SUCCESS_TOAST_MESSAGES,
  TOAST_DURATION_MS,
  TOAST_POSITION,
} from '@/constants'

export function AppToasts() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { resolvedTheme } = useTheme()

  const toastType = searchParams.get('toast')

  useEffect(() => {
    if (!toastType) return

    const message = SUCCESS_TOAST_MESSAGES[toastType]

    if (!message) return

    toast.success(message, { id: `success-${toastType}` })

    const nextSearchParams = new URLSearchParams(searchParams.toString())
    nextSearchParams.delete('toast')

    const queryString = nextSearchParams.toString()

    router.replace(queryString ? `${pathname}?${queryString}` : pathname)
  }, [pathname, router, searchParams, toastType])

  return (
    <Toaster
      theme={resolvedTheme}
      position={TOAST_POSITION}
      duration={TOAST_DURATION_MS}
      richColors
      closeButton
    />
  )
}
