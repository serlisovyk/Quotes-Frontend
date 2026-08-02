import Link from 'next/link'
import CategoryTags from '@components/CategoryTags'
import { renderQuoteText } from '@utils/utils'
import { MAX_VISIBLE_TEXT_LENGTH } from '@config/constants'

export default function Quote({ quote, selectedCategory, searchText }) {
  const { id, text, author, categories } = quote

  const isTruncated = text.length > MAX_VISIBLE_TEXT_LENGTH
  const visiblePart = isTruncated ? text.slice(0, MAX_VISIBLE_TEXT_LENGTH) : text

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-4 shadow-md rounded-lg hover:-translate-y-1.5 hover:bg-gray-100 hover:dark:bg-gray-700 transition-transform duration 400">
      <Link href={`/quotes/${id}`}>
        <p className="mb-4 text-xl italic text-gray-900 dark:text-gray-100">
          &quot;
          {renderQuoteText({ fullText: text, visiblePart, searchText, isTruncated })}
          &quot;
        </p>
      </Link>

      <p className="mb-10 text-right text-xl font-semibold text-gray-700 dark:text-gray-300">
        <Link href={`/search?author=${author}`}>
          —{' '}
          <span className="hover:underline hover:text-blue-600 hover:dark:text-blue-300">
            {author}
          </span>
        </Link>
      </p>

      <CategoryTags categories={categories} selectedCategory={selectedCategory} />
    </div>
  )
}
