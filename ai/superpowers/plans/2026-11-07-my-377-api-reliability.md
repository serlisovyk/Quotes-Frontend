# Plan: reliable API requests and error screens (MY-377)

Branch `my-377-api-reliability`. Behavior spec: `ai/superpowers/specs/2026-11-07-my-377-api-reliability.md`.
Baseline: 527 tests.

## Author's decisions (2026-11-07)

- All five points of the issue are agreed; the timeout length is chosen in this plan and kept in a constant.
- No external error tracking (Sentry and the like): `console.error` only.

## Decisions made in this plan

- **Timeout: 8 seconds** (`API_REQUEST_TIMEOUT_MS`). The backend answers in well under a second, so 8 s
  already means it is stuck; it stays below the 10 s a serverless function is commonly given, so the error
  state still renders before the platform kills the render.
- **Signal merging:** `AbortSignal.any([callerSignal, AbortSignal.timeout(ms)])` when the call has its own
  `signal`, `AbortSignal.timeout(ms)` otherwise. No new dependency.
- **URL building:** the fetcher strips trailing slashes from `API_URL` and leading ones from the endpoint.
- **Allow-lists:** the fetcher no longer filters. `fetcher.get(endpoint, queryString, fetchOptions)` takes a
  ready query string; each service builds it with `createSearchQueryString(params, ALLOWED_..._PARAM_NAMES)`
  (quotes: `ALLOWED_SEARCH_PARAM_NAMES`, categories: `ALLOWED_CATEGORIES_PARAM_NAMES`).
  `ALLOWED_API_QUERY_PARAM_NAMES` is deleted.
- **429:** `getApiErrorMessages` returns one fixed message (`TOO_MANY_REQUESTS_MESSAGE`) for status 429, so
  the forms and the delete button get it through the existing `createApiErrorState` and
  `createDeleteApiErrorState`.
- **Error screens:** the markup of `error.jsx` moves to a small component `ErrorScreen`, used by `error.jsx`
  and `global-error.jsx`; the logging is a hook `useErrorLogging(error)` (an effect that writes to the
  console), used by both.
- **`global-error.jsx` theme:** it renders its own `<html>` and imports `globals.css`; the colours are the
  usual role tokens. The head script cannot be used: a script React inserts while client-rendering the
  page never runs. `useTheme` sets `data-theme` after hydration instead (the saved choice, else the
  system scheme), so a dark page may flash light for a moment. No fonts: the site's stack is the
  system one.
- **Decision record** `2026-11-07-api-timeout-and-error-logging`: the 8 s value and no external tracker.

## Order (each behavior: failing `test:` commit, then `fix:`/`feat:`, then `refactor:`)

1. Fetcher: trailing slash on `API_URL`, leading slash on the endpoint.
2. Fetcher: timeout, merged with a caller signal.
3. Allow-lists per service, fetcher takes a query string, shared list removed.
4. 429 message in `getApiErrorMessages` (and the two action states).
5. `useErrorLogging` and `error.jsx` logging.
6. `ErrorScreen` extraction, `global-error.jsx`.
7. Docs: `ai/map.md`, decision record and its index entry, `README.md` only if a line is needed.

## Verification

`format:check`, `lint`, `test:coverage` (thresholds only go up), `build`. By hand on `npm run dev`:
`API_URL` with and without the trailing slash (curl the pages, no 308); a local server that accepts and
never answers: pages show their error state after about 8 s; error screens forced temporarily and not
committed (`global-error` in a production build with `next start`), light and dark, 390 px.
