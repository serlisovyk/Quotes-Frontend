import Link from 'next/link'
import { CategoryTags } from '@/components/category-tags'
import { createSearchQueryString } from '@/utils/query-string'
import { renderQuoteText } from '@/utils/render-quote-text'
import { MAX_VISIBLE_TEXT_LENGTH, ROUTES } from '@/constants'

export function Quote({ quote, selectedCategory, searchText }) {
  const { id, text, author, categories } = quote

  const isTruncated = text.length > MAX_VISIBLE_TEXT_LENGTH
  const visiblePart = isTruncated ? text.slice(0, MAX_VISIBLE_TEXT_LENGTH) : text

  return (
    <div className="rounded-lg bg-gray-200 p-4 shadow-md transition-transform duration-300 hover:-translate-y-1.5 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
      <Link href={`/quotes/${id}`}>
        <p className="mb-4 text-xl italic text-gray-900 dark:text-gray-100">
          &quot;
          {renderQuoteText({
            fullText: text,
            visiblePart,
            searchText,
            isTruncated,
          })}
          &quot;
        </p>
      </Link>

      <p className="mb-10 text-right text-xl font-semibold text-gray-700 dark:text-gray-300">
        <Link href={`${ROUTES.SEARCH}?${createSearchQueryString({ author })}`}>
          -{' '}
          <span className="hover:text-blue-600 hover:underline hover:dark:text-blue-300">
            {author}
          </span>
        </Link>
      </p>

      <CategoryTags categories={categories} selectedCategory={selectedCategory} />
    </div>
  )
}
