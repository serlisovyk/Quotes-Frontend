import CategoryTag from '@components/CategoryTag'
import { getDisplayedCategories } from '@utils/utils'
import { MAX_VISIBLE_CATEGORIES } from '@config/constants'

export default function CategoryTags({
  categories,
  selectedCategory,
  isSingleQuotePage,
}) {
  const displayedCategories = getDisplayedCategories(
    categories,
    selectedCategory,
    isSingleQuotePage
  )

  return (
    <div
      className={`${
        isSingleQuotePage && 'justify-center gap-3'
      } flex flex-wrap mt-2`}
    >
      {displayedCategories?.map((category) => (
        <CategoryTag
          key={category}
          category={category}
          selectedCategory={selectedCategory}
          isSingleQuotePage={isSingleQuotePage}
        />
      ))}
      {!isSingleQuotePage && categories.length > MAX_VISIBLE_CATEGORIES && (
        <span className="text-3xl">...</span>
      )}
    </div>
  )
}
