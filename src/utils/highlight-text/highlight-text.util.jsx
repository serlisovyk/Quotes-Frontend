import { escapeRegExp } from '@/utils/escape-reg-exp'
import { HIGHLIGHT_STYLES } from '@/constants'

export function highlightText(text, searchText) {
  if (!searchText || searchText.length < 3) return text

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
