# API request timeout and console-only error logging

Date: 2026-11-07 · Status: accepted

## Context

The pages call the backend on the server, so a backend that never answers leaves the visitor on a blank
page until the platform cuts the render. Failed page loads also left no trace, and an error tracker was
the obvious next step.

## Decision

- Every request made by the fetcher is aborted after 8 seconds (`API_REQUEST_TIMEOUT_MS`), merged with
  the caller's own `signal` through `AbortSignal.any`. The backend normally answers in well under a
  second, and 8 s stays below the 10 s a serverless render is commonly given, so the page can still show
  its error state. The abort is an ordinary thrown error: the services already turn it into `hasError`,
  `null` or the page's `error.jsx`, and forms and the delete button show it inline.
- `error.jsx` and `global-error.jsx` write the error and its digest to the console and nothing else.
- Rejected: an external error tracker (Sentry and the like), by the author's decision: another account,
  dependency and privacy surface for a small project; the host's server logs already hold the console
  output.
- Rejected: retries on timeout. The backend rate limit is shared by every visitor behind one server IP,
  so a retry makes the limit harder to stay under.

## Consequences

- A longer legitimate request (a bigger payload, a slow cold start) needs the constant raised, not a
  per-call exception.
- A new way to report errors needs its own record.
