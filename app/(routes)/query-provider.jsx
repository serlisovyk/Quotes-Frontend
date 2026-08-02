'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 6000 } },
  })
}

let browserClient

export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      typeof window === 'undefined'
        ? makeQueryClient() // server
        : (browserClient ??= makeQueryClient()) // client
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
