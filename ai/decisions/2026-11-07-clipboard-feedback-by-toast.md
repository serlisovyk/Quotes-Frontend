# Clipboard and share feedback is a toast, failures included

Date: 2026-11-07 · Status: accepted

## Context

`toasts-and-inline-errors` keeps failures inline because a mutation fails next to a form or a button
the user can fix. Copying or sharing a quote has no field and nothing to retry beyond clicking again.

## Decision

- Copy and share report both outcomes with a Sonner toast: success, a missing or refused clipboard, and a
  failed share sheet.
- The user closing the share sheet (`AbortError`) is not an error and shows nothing.
- Without `navigator.share` the share button copies the quote link. The link is built from
  `window.location.origin`, not `SITE_URL`, so it is right on every host the page is served from.
- Both buttons only read, so they stay in read-only mode (`read-only-mode`).
- Rejected: an inline message under the button. The card has no room for it and a short-lived hint is all
  a clipboard failure needs.

## Consequences

- `toasts-and-inline-errors` still holds for mutations and forms; only the clipboard feedback differs.
- A new clipboard or share outcome is a message in `QUOTE_ACTION_TOAST_MESSAGES`, shown from
  `useQuoteActions`.
