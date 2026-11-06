import { MAX_VISIBLE_CATEGORIES } from '@/constants'

export function getDisplayedCategories(
  categories,
  selectedCategory,
  isSingleQuotePage = false,
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
