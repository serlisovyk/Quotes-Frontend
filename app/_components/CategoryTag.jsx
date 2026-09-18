import Link from 'next/link'

export default function CategoryTag({
  category,
  selectedCategory,
  isSingleQuotePage,
}) {
  const isSelected = category === selectedCategory
  const baseClasses =
    'transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'

  const pageSpecificClasses = isSingleQuotePage
    ? 'rounded-lg bg-violet-200 px-4 py-2 text-base text-violet-900 hover:bg-violet-300 dark:bg-violet-700 dark:text-violet-100 hover:dark:bg-violet-800'
    : `${
        isSelected
          ? 'bg-yellow-200'
          : 'bg-blue-200 hover:bg-blue-500 hover:text-gray-100'
      } mr-2 mb-2 rounded-full px-2 py-1 text-lg text-gray-700 dark:text-gray-800`

  return (
    <Link
      href={`/search?category=${encodeURIComponent(category)}`}
      aria-current={isSelected ? 'true' : undefined}
      className={`${baseClasses} ${pageSpecificClasses}`}
    >
      {category}
    </Link>
  )
}
