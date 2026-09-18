# Cache Strategy

The app uses native Next.js caching instead of TanStack Query.

## Current Rules

- Home quote: cached for `HOME_QUOTE_REVALIDATE_SECONDS`.
- Quote details: cached for `QUOTE_DETAILS_REVALIDATE_SECONDS`.
- Search results: `cache: 'no-store'`, because query parameters are user-driven and should feel fresh.
- Random quotes: `cache: 'no-store'`, because each refresh is expected to request a new set.
- Create, update, and delete actions call `revalidatePath` for affected public pages before redirecting.

## Why This Shape

The app has a small public read surface and direct mutations. Time-based revalidation is enough for stable quote pages, while interactive lists stay uncached to avoid surprising search and random behavior.

## Future Options

- Add `generateStaticParams` for a small curated set of quote detail pages only if the backend exposes a reliable list of IDs.
- Add tag-based invalidation if more quote lists appear and path invalidation becomes too broad.
- Tune quote detail revalidation after real usage data. Ten minutes is a conservative default, not a permanent rule.
