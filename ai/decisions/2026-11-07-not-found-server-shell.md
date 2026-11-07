# A `notFound()` page is a 404 with an empty server shell

Date: 2026-11-07 · Status: accepted

## Context

`notFound()` called by a page (`/quotes/abc`, `/quotes/999999999`) escapes the server render before the
shell flushes. Next.js 16 then answers with the status 404 and `<html id="__next_error__">` with an empty
body; the browser renders the root layout and `not-found.jsx` from the inlined data. A page that does
nothing but `notFound()` under a layout reduced to `{children}` behaves the same, so no component of ours
causes it. An unknown URL (`/nope`) has no page to throw from and is rendered on the server, header
included. A `Suspense` around `{children}` puts the header into the server HTML but turns the status
into 200.

## Decision

- The status 404 outranks a server-rendered header: the pages keep calling `notFound()`, the layout has no
  `Suspense` around `{children}` (see `no-loading-above-not-found`).
- The layout sets no `robots` metadata: Next.js adds `noindex` to a 404, and a layout rule rendered a
  second, contradicting tag. Pages that must not be indexed set their own.
- Rejected: a `Suspense` above the pages (status 200), `global-not-found` (see
  `root-layout-at-app-root`), a proxy or middleware that rewrites to an unknown URL (a request to the API
  for every page view).

## Consequences

- Without scripts a missing quote shows an empty page with the status 404; with scripts the header, the
  message and the footer appear. Crawlers get the status.
- A check of a 404 reads the status, the number of `robots` tags (one) and, for `/nope`, the header in
  the server HTML; for `notFound()` pages the header is checked in the browser.
- Revisit when Next.js renders the layout around a thrown `notFound()` on the server.
