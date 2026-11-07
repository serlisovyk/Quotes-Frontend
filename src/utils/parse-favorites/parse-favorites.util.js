const isSnapshot = (entry) => {
  if (typeof entry !== 'object' || entry === null) return false

  const { id, text, author, categories } = entry

  const hasValidId = Number.isSafeInteger(id) && id > 0
  const hasValidText = typeof text === 'string' && text !== ''
  const hasValidAuthor = typeof author === 'string'
  const hasValidCategories =
    Array.isArray(categories) &&
    categories.every((category) => typeof category === 'string')

  return hasValidId && hasValidText && hasValidAuthor && hasValidCategories
}

const parseJson = (raw) => {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function parseFavorites(raw) {
  const entries = parseJson(raw)

  if (!Array.isArray(entries)) return []

  const snapshots = entries
    .filter(isSnapshot)
    .map(({ id, text, author, categories }) => ({ id, text, author, categories }))
  const uniqueSnapshots = snapshots.filter(
    ({ id }, index) => snapshots.findIndex((entry) => entry.id === id) === index,
  )

  return uniqueSnapshots
}
