# Plan: 404, error and loading states, noindex for forms (MY-236)

Branch `my-236-not-found-error-loading`. Behavior: `ai/superpowers/specs/2026-11-06-not-found-error-loading.md`.

## Author's decisions (2026-11-06)

- An invalid id and a 404 from the API: `notFound()`, a custom `app/(routes)/not-found.jsx`. A network
  error or a 5xx is thrown and caught by `app/(routes)/error.jsx` with a "Try again" button. Same for the
  quote page and the edit page.
- TDD: failing tests first, committed alone as `test:`.

## Decisions in this plan

- **Service.** A new `fetchQuoteIfExists(id, fetchOptions)` in `services.js`: it returns `null` only for
  an `ApiError` with status 404 and rethrows everything else. The quote and edit pages use it and call
  `notFound()` on `null` or an invalid id. `fetchQuoteByIdOrNull` stays as it is (any failure is `null`),
  so the home page, which renders without the card on any failure, is untouched. Changing
  `fetchQuoteByIdOrNull` instead would force a try/catch into the home page.
- **404 status** comes from `notFound()` in the page; the root layout is untouched.
- **`error.jsx`** is a client component (Next requires it) at `(routes)` level, so the header and footer
  stay. "Try again" reuses `Button` with `onClick={reset}`.
- **`loading.jsx`**: one at `(routes)` level over the existing `Loader`, in a `role="status"` element with
  an `sr-only` "Loading"; per-route files would be identical. The built HTML of the static pages (home,
  create) is checked to still hold their content, not the spinner (the boundary rule in
  `architecture.md`).
- **`QuoteNotFoundMessage`** has no use left once the pages call `notFound()` (its uses are the quote
  page, the edit page and its own test); it is deleted with its test.
- **noindex**: `robots: { index: false }` in the create `metadata` and the edit `generateMetadata`.
- No new decision record: it follows `toasts-and-inline-errors` (the error page is for a failed page
  load; inline errors stay for forms) and `native-next-caching`.

## Changes

- `app/_services/services.js`: `fetchQuoteIfExists`.
- `app/(routes)/quotes/[id]/page.jsx`, `edit/page.jsx`: guards with `notFound()`; edit metadata `robots`.
- `app/(routes)/quotes/create/page.jsx`: metadata `robots`.
- `app/(routes)/not-found.jsx`, `error.jsx`, `loading.jsx`: new.
- `app/sitemap.js`: `/quotes/create` removed.
- `app/_components/QuoteNotFoundMessage.jsx` and its test: removed.
- `ai/map.md`: route files, removed component, the "does not have" line; `ai/rules/architecture.md`: one
  line on the not-found / error split.

## Tests (written first, red)

- `_services/__tests__/services.test.js`: `fetchQuoteIfExists` returns the quote, `null` for 404,
  rethrows a 500 and a network error.
- `quotes/[id]/__tests__/page.test.jsx`, `quotes/[id]/edit/__tests__/page.test.jsx`: `notFound` called for
  an invalid id (service not called) and for `null`; a rejection propagates; edit metadata `noindex`.
- `quotes/create/__tests__/page.test.jsx`: metadata `noindex`.
- `__tests__/not-found.test.jsx`, `error.test.jsx`, `loading.test.jsx` in `(routes)`: headings and
  actions, `reset` called on click.
- `app/__tests__/sitemap.test.js` (`@config/site` mocked): no `/quotes/create`.

## Verification

The four checks, plus `npx jest` without `.env`. Production build on port 4107: statuses of
`/quotes/999999999`, `/quotes/abc`, `/nope` (404), `API_URL` pointing at an unreachable host for the
error page, `noindex` in create and edit HTML, `sitemap.xml`; then `npm run dev` for the look at desktop
and 390 px with the keyboard.
