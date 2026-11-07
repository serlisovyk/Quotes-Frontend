import { toast } from 'sonner'
import { createQuoteShareData } from '@/utils/create-quote-share-data'
import { formatQuoteText } from '@/utils/format-quote-text'
import { QUOTE_ACTION_TOAST_MESSAGES } from '@/constants'

export function useQuoteActions(quote) {
  const copyToClipboard = async (value, successMessage) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      toast.error(QUOTE_ACTION_TOAST_MESSAGES.COPY_FAILED)

      return
    }

    toast.success(successMessage)
  }

  const copyQuote = () =>
    copyToClipboard(formatQuoteText(quote), QUOTE_ACTION_TOAST_MESSAGES.QUOTE_COPIED)

  const shareQuote = async () => {
    const shareData = createQuoteShareData({ quote, origin: window.location.origin })

    if (typeof navigator.share !== 'function') {
      await copyToClipboard(shareData.url, QUOTE_ACTION_TOAST_MESSAGES.LINK_COPIED)

      return
    }

    try {
      await navigator.share(shareData)
    } catch (error) {
      if (error.name === 'AbortError') return

      toast.error(QUOTE_ACTION_TOAST_MESSAGES.SHARE_FAILED)
    }
  }

  return { copyQuote, shareQuote }
}
