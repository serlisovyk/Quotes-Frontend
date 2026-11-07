# Category suggestions through a Route Handler

Date: 2026-11-07 · Status: accepted

## Context

The category fields suggest existing names while the user types, so the browser must read `/categories`
on every keystroke. `API_URL` stays server-only (`api-url-server-only`), and the ESLint rule keeps the
global `fetch` inside `src/services`. The earlier rule "no client-side data fetching" had no exception.

## Decision

- The browser reads suggestions from our own `GET /api/categories?name=` (a Route Handler over
  `fetchCategoriesResult`). It validates the name, fixes the limit server-side, answers 400 for a bad
  name and 502 for a failed read, always with `{ categories }`.
- The browser call is a service of its own, `services/category-suggestions`, without `server-only`: it
  talks to our route, never to `API_URL`, and it keeps the `fetch` rule intact.
- The input is debounced, the older request is cancelled with `AbortController`, and an error shows no
  suggestions and no toast: suggestions are a convenience, not a result the page depends on.
- Rejected: a Server Action. Actions run one after another and cannot be aborted, so a stale lookup would
  delay the next one. Rejected: a `datalist` (no keyboard or screen-reader control over the list, no
  token completion). Rejected: a public `NEXT_PUBLIC_API_URL` and a direct browser call.

## Consequences

- This is the only client-side data read; any other needs its own record.
- A new client fetch goes behind a Route Handler and a client-safe service, never straight to the backend.
