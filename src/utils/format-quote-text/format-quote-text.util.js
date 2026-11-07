export function formatQuoteText({ text, author }) {
  const quotedText = `"${text}"`

  if (!author) return quotedText

  return `${quotedText} — ${author}`
}
