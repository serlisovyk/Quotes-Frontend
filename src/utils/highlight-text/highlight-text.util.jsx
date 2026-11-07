import { escapeRegExp } from '@/utils/escape-reg-exp'
import { HIGHLIGHT_STYLES, MIN_HIGHLIGHT_LENGTH } from '@/constants'

export function highlightText(text, searchText) {
  if (!searchText || searchText.length < MIN_HIGHLIGHT_LENGTH) return text

  const parts = text.split(new RegExp(`(${escapeRegExp(searchText)})`, 'gi'))

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchText.toLowerCase()) {
      return (
        <span key={index} className={HIGHLIGHT_STYLES}>
          {part}
        </span>
      )
    }
    return part
  })
}
