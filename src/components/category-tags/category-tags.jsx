import { CategoryTag } from '@/components/category-tag'
import { getDisplayedCategories } from '@/utils/get-displayed-categories'
import {
  CATEGORY_TAGS_SINGLE_QUOTE_CLASSES,
  MAX_VISIBLE_CATEGORIES,
} from '@/constants'

export function CategoryTags({ categories, selectedCategory, isSingleQuotePage }) {
  const displayedCategories = getDisplayedCategories(
    categories,
    selectedCategory,
    isSingleQuotePage,
  )

  const layoutClasses = isSingleQuotePage ? CATEGORY_TAGS_SINGLE_QUOTE_CLASSES : ''
  const hasHiddenCategories =
    !isSingleQuotePage && categories.length > MAX_VISIBLE_CATEGORIES

  return (
    <div className={`${layoutClasses} flex flex-wrap mt-2`.trim()}>
      {displayedCategories.map((category) => (
        <CategoryTag
          key={category}
          category={category}
          selectedCategory={selectedCategory}
          isSingleQuotePage={isSingleQuotePage}
        />
      ))}

      {hasHiddenCategories && <span className="text-3xl">...</span>}
    </div>
  )
}
