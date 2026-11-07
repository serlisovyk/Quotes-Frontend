# Security headers without a full CSP

Date: 2026-11-07 · Status: accepted

## Context

The site sent no security headers: it could be framed by any page and had no `nosniff`, referrer or
permissions policy. A complete `Content-Security-Policy` is the usual next step, but the root layout holds an
inline theme script (`ai/decisions/2026-11-07-theme-three-states.md`) and Next adds inline scripts of its own.
A policy without `'unsafe-inline'` needs a per-request nonce, and a nonce makes every page dynamic, which
gives up the static and cached pages (`ai/decisions/2026-11-06-native-next-caching.md`).

## Decision

- Every path gets `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Frame-Options: DENY`, `Permissions-Policy` with camera, microphone and geolocation off, and
  `Content-Security-Policy: frame-ancestors 'none'`. The values are constants (`SECURITY_HEADERS`).
- The only CSP directive sent is `frame-ancestors 'none'`: it blocks framing without restricting scripts,
  and sits beside `X-Frame-Options` for browsers that read only one of them.
- Rejected: a full CSP with a nonce (all pages dynamic). Rejected: a full CSP with `'unsafe-inline'` (it
  protects against nothing a script injection needs).
- No Dependabot: the author updates dependencies by hand (`npm outdated`), automated update PRs are not
  wanted.

## Consequences

- A new header is a line in `SECURITY_HEADERS`; the site stays static where it was.
- A full CSP is reconsidered only if the inline scripts go away or the pages are dynamic anyway; that is a
  new record superseding this one.
