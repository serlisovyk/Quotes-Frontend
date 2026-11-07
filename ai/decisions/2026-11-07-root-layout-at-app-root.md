# Root layout at `src/app`, not in a route group

Date: 2026-11-07 · Status: accepted

## Context

With the root layout inside the `(routes)` group, Next.js had no layout beside `src/app/not-found.jsx` for a
URL that matches no route. `/nope` answered 404 with the stock "404: This page could not be found." page,
without the header and footer; the project's not-found page showed only for `notFound()` inside a route. A
status check alone (`curl`) did not reveal it.

## Decision

- `layout.jsx`, `not-found.jsx`, `error.jsx`, `globals.css` and `fonts/` sit at the root of `src/app`,
  with the pages beside them. There is no route group: it had no other purpose.
- Rejected: `global-not-found.jsx` (experimental flag, and it renders without the site layout, so the
  header and footer would be duplicated or missing).
- The `error.jsx` / `loading.jsx` placement rules of `no-loading-above-not-found` stay in force.

## Consequences

- One 404 page serves unknown URLs and `notFound()` alike.
- A new route group is added only for a real reason (a second layout), and a not-found page is then
  checked for unknown URLs too, not only for its status code.
