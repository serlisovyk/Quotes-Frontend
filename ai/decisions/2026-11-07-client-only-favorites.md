# Favorite quotes live only in the browser

Date: 2026-11-07 · Status: accepted

## Context

Readers want to keep a quote and find it again. The site has no accounts and the backend's rate limit
(100 requests per 15 minutes) is shared by every visitor, so a favorites page that fetches each quote by
id would spend the limit of the whole site.

## Decision

- Favorites are one `localStorage` list under `quotes:favorites`: snapshots of id, text, author and
  categories, newest first. `/favorites` renders them with no API call. Read-only mode keeps them
  (`read-only-mode`): they never write to the backend.
- No sync between devices, no account, no export. Another tab follows through the `storage` event.
- The store is `useSyncExternalStore` over `favorites-storage`, like the theme (`theme-three-states`). Its
  server snapshot is "not loaded", so the server markup never depends on the storage and no empty state
  flashes for someone who has favorites.
- A broken value, a missing storage or a failed write never throws: the list is empty, or lives in memory
  until the page closes.
- The star is a toggle (`aria-pressed`) whose label also changes, as the author asked. It gives no toast:
  the pressed star already shows the result and a toast would be a second announcement
  (`clipboard-feedback-by-toast` is for outcomes nothing else shows).
- Rejected: storing only ids and fetching on `/favorites` (spends the shared limit); a backend favorites
  endpoint (needs accounts).

## Consequences

- A snapshot can go stale when the quote is edited or deleted; the saved text stays until the user removes
  it, and its link may lead to a 404.
- Clearing site data clears the favorites.
