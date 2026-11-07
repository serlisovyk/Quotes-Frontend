import Link from 'next/link'
import { AuthorLink } from '@/components/author-link'
import { CategoryTags } from '@/components/category-tags'
import { renderQuoteText } from '@/utils/render-quote-text'
import { LINK_FOCUS_CLASSES, MAX_VISIBLE_TEXT_LENGTH, ROUTES } from '@/constants'

export function Quote({ quote, selectedCategory, searchText }) {
  const { id, text, author, categories } = quote

  const isTruncated = text.length > MAX_VISIBLE_TEXT_LENGTH
  const visiblePart = isTruncated ? text.slice(0, MAX_VISIBLE_TEXT_LENGTH) : text

  return (
    <div className="rounded-lg bg-surface p-4 shadow-md transition-transform duration-base hover:-translate-y-1.5 hover:bg-surface-hover">
      <Link href={`${ROUTES.QUOTES}/${id}`} className={LINK_FOCUS_CLASSES}>
        <p className="mb-4 text-xl italic text-body">
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

      <p className="mb-10 text-right text-xl font-semibold text-muted">
        <AuthorLink author={author} />
      </p>

      <CategoryTags categories={categories} selectedCategory={selectedCategory} />
    </div>
  )
}
