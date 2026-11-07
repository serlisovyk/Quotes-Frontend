export function toggleQuoteInFavorites(favorites, quote) {
  const { id, text, author, categories } = quote

  const isSaved = favorites.some((favorite) => favorite.id === id)

  if (isSaved) return favorites.filter((favorite) => favorite.id !== id)

  return [{ id, text, author, categories }, ...favorites]
}
