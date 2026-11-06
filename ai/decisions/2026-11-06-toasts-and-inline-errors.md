# Sonner toasts for success, inline errors for failures

Date: 2026-11-06 · Status: accepted

## Context

Create, update and delete end in a redirect, and a failure leaves the user on the form or the button
that failed. Showing both outcomes as toasts was the alternative.

## Decision

- Success is a Sonner toast: the action redirects with `?toast=created|updated|deleted`, `AppToasts`
  shows the toast and removes the parameter from the URL.
- A failure is an inline message next to the form field, above the form button, or under the delete
  button, in the page itself, where the user can read it and fix the input.
- Rejected: error toasts. They disappear after a few seconds, are away from the field that failed and
  cannot keep the typed values and the message together.

## Consequences

- A new mutation follows the same pair: a redirect with a toast type for success, form state with
  `errors` and `formError` for failure.
- A new success message is added to the toast map in `AppToasts`.
