import { formatQuoteText } from '@/utils/format-quote-text'
import { QUOTE_SHARE_TITLE, ROUTES } from '@/constants'

export function createQuoteShareData({ quote, origin }) {
  const { id, text, author } = quote

  const title = author ? `${QUOTE_SHARE_TITLE} by ${author}` : QUOTE_SHARE_TITLE

  return {
    title,
    text: formatQuoteText({ text, author }),
    url: `${origin}${ROUTES.QUOTES}/${id}`,
  }
}
