export function isSameCategory(category, otherCategory) {
  if (!category || !otherCategory) return false

  return category.toLowerCase() === otherCategory.toLowerCase()
}
