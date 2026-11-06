# `API_URL` is server-only

Date: 2026-11-06 · Status: accepted

## Context

The frontend talks to a separate backend API. Reading the base URL in the browser (a `NEXT_PUBLIC_`
variable and client-side `fetch`) was the simple alternative.

## Decision

- `API_URL` is a plain environment variable, never `NEXT_PUBLIC_`, read only in `_services`.
- Every backend call happens on the server: in a server component, a page or a Server Action, through
  `_services`, which import `server-only`.
- Rejected: client-side calls. They expose the backend origin to the browser and need CORS on the
  backend.

## Consequences

- A client component gets its data as props or triggers a Server Action; it never calls the API.
- Tests that import services map `server-only` to an empty module.
