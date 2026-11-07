import { useEffect } from 'react'

export function useErrorLogging(error) {
  useEffect(() => {
    if (error.digest) {
      console.error(error, { digest: error.digest })

      return
    }

    console.error(error)
  }, [error])
}
