import { NextResponse } from 'next/server'
import { fetchCategoriesResult } from '@/services/categories'
import { isCategorySearchName } from '@/utils/validation'
import {
  CATEGORY_SUGGESTIONS_LIMIT,
  HTTP_STATUS_BAD_GATEWAY,
  HTTP_STATUS_BAD_REQUEST,
} from '@/constants'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') ?? ''

  if (!isCategorySearchName(name)) {
    return NextResponse.json({ categories: [] }, { status: HTTP_STATUS_BAD_REQUEST })
  }

  const { categories, hasError } = await fetchCategoriesResult({
    name,
    limit: CATEGORY_SUGGESTIONS_LIMIT,
  })

  if (hasError) {
    return NextResponse.json({ categories: [] }, { status: HTTP_STATUS_BAD_GATEWAY })
  }

  return NextResponse.json({ categories })
}
