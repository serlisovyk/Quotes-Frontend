import { MAX_VISIBLE_CATEGORIES } from '@/constants'

export function getDisplayedCategories(
  categories,
  selectedCategory,
  isSingleQuotePage = false,
) {
  if (isSingleQuotePage) return categories

  const visible = categories.slice(0, MAX_VISIBLE_CATEGORIES)

  const selected = selectedCategory?.toLowerCase()
  const isSelected = (category) => category.toLowerCase() === selected

  if (!selected || visible.some(isSelected)) return visible

  const hiddenSelected = categories.find(isSelected)

  if (hiddenSelected) return [...visible.slice(0, -1), hiddenSelected]

  return visible
}
