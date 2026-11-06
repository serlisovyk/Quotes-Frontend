import { highlightText } from '@/utils/highlight-text'
import { HIGHLIGHT_STYLES } from '@/constants'

export function renderQuoteText({ fullText, visiblePart, searchText, isTruncated }) {
  if (!searchText || searchText.length < 3) {
    return isTruncated ? `${visiblePart}...` : visiblePart
  }

  const search = searchText.toLowerCase()
  const hasInVisible = visiblePart.toLowerCase().includes(search)
  const hasInFull = fullText.toLowerCase().includes(search)

  if (hasInVisible) {
    return (
      <>
        {highlightText(visiblePart, searchText)}
        {isTruncated && '...'}
      </>
    )
  }

  if (isTruncated && hasInFull) {
    return (
      <>
        {visiblePart}
        <span className={HIGHLIGHT_STYLES}>...</span>
      </>
    )
  }

  return isTruncated ? `${visiblePart}...` : visiblePart
}
