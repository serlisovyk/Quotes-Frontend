# Read-only mode by a server flag

Date: 2026-11-07 · Status: accepted

## Context

On the public site anyone can create, change or delete any quote: neither the frontend nor the backend
guards mutations. The backend also limits requests per IP, and the site calls it from its own server, so
that limit is shared by every visitor.

## Decision

- `READ_ONLY=true` (server-only, never `NEXT_PUBLIC_`, parsed strictly: only `true`, trimmed, any case)
  turns the site read-only. Without it, or with any other value, nothing changes.
- Read-only means: no «Create New» in the menu, no Edit and Delete on the quote page, `/quotes/create`
  and `/quotes/:id/edit` are 404, and the three Server Actions return an error without calling the API.
  The layout passes the flag to the client `Header` as a prop.
- Production runs with the flag on; the backend is not changed.
- Rejected: an API key or authentication. It needs backend work and a sign-in flow for a demo site with
  one audience; the flag closes the hole now at the cost of a read-only demo.
- Known risk, accepted: the backend's per-IP request limit stays shared by all visitors, so heavy reading
  can still exhaust it. Fixing it is a backend task.

## Consequences

- The flag is read at build time by the prerendered pages (home, `/quotes/create`)
  and at run time by the dynamic ones (quote, edit, search, random) and by the actions. Set it for both:
  a build without it serves a static create page and a home header with «Create New» even when the run
  has it. The `Dockerfile` takes an `ARG READ_ONLY` and CI passes it (`no-env-files-in-image`); `--env-file`
  carries it at run time.
- The actions are the one guard that always follows the run environment.
- Turning the mode on or off in a deployed site means a new build, not only a restart.
