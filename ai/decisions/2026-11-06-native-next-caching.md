# Native Next.js caching instead of TanStack Query

Date: 2026-11-06 · Status: accepted

## Context

The app has a small public read surface (home, search, random, quote details) and direct mutations. A
client-side server-state library such as TanStack Query was the obvious alternative for fetching and
caching.

## Decision

- Pages fetch on the server and rely on the native Next.js `fetch` cache and `revalidatePath`.
- Home quote: time-based revalidation (`HOME_QUOTE_REVALIDATE_SECONDS`). Quote details: time-based
  revalidation (`QUOTE_DETAILS_REVALIDATE_SECONDS`).
- Search results and random quotes: `cache: 'no-store'`, because search parameters are user-driven and a
  refresh is expected to return a new set.
- Create, update and delete actions call `revalidatePath` for every affected public page before they
  redirect.
- Rejected: TanStack Query. It would move fetching to the browser, expose the API origin to it, and add a
  dependency and a provider for a surface that time-based revalidation already covers.

## Consequences

- The cache lifetimes are constants in `_config/constants.js`; ten minutes for quote details is a
  conservative default, tuned only from real usage.
- If quote lists multiply and path invalidation becomes too broad, tag-based invalidation is the next
  step; `generateStaticParams` for quote details only makes sense if the backend exposes a reliable list
  of ids.
- A client-side server-state library needs the author's explicit request and a new record.
