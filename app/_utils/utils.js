import {
  MAX_VISIBLE_CATEGORIES,
  QUOTES_API_ENDPOINT,
  HIGHLIGHT_STYLES,
} from '@config/constants'

export const getSingleQuoteApiEndpoint = (id) => `${QUOTES_API_ENDPOINT}/${id}`

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

export function highlightText(text, searchText) {
  if (!searchText || searchText.length < 3) return text

  const parts = text.split(new RegExp(`(${searchText})`, 'gi'))

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

export function getDisplayedCategories(
  categories,
  selectedCategory,
  isSingleQuotePage = false
) {
  if (isSingleQuotePage) return categories

  const visible = categories.slice(0, MAX_VISIBLE_CATEGORIES)

  if (!selectedCategory || visible.includes(selectedCategory)) {
    return visible
  }

  if (categories.includes(selectedCategory)) {
    return [...visible.slice(0, -1), selectedCategory]
  }

  return visible
}
