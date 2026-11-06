# No `loading.jsx` above a route that calls `notFound()`

Date: 2026-11-06 · Status: accepted

## Context

A missing quote must answer HTTP 404 (`ai/rules/architecture.md`: missing calls `notFound()`, a
failure goes to `error.jsx`). A `loading.jsx` wraps the segment below it in a Suspense
boundary, so Next.js starts streaming the page shell with status 200 before the page runs; a
`notFound()` called after that renders the not-found page, but the status stays 200. A production
build answered 200 for `/quotes/999999999` with one `loading.jsx` at the `(routes)` level.

## Decision

- No `loading.jsx` in the route group root or in any segment above a page that calls `notFound()`
  (the quote page and the edit page).
- A loading state lives only next to pages that never call `notFound()` (`random`, `search`), through
  the shared loading component.
- Rejected: one `loading.jsx` for every page (soft 404s for search engines), and a loading state inside
  the quote pages through their own Suspense (the status problem is the same).

## Consequences

- The quote and edit pages show no loading state; each waits for a single request.
- A new page with a loading state checks the status of its not-found case on a production build
  (`curl -s -o /dev/null -w "%{http_code}"`), not only in `next dev`.
