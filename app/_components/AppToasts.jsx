'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Toaster, toast } from 'sonner'

const SUCCESS_TOAST_MESSAGES = {
  created: 'Quote created successfully.',
  updated: 'Quote updated successfully.',
  deleted: 'Quote deleted successfully.',
}

export default function AppToasts() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
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

  return <Toaster position="top-right" duration={5000} richColors closeButton />
}
