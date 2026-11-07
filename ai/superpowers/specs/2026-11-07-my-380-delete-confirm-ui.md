# Spec: delete confirmation and UI polish (MY-380)

Plan: `ai/superpowers/plans/2026-11-07-my-380-delete-confirm-ui.md`.

## Delete confirmation

- The Delete button on the quote page opens a modal dialog and deletes nothing.
- The dialog has a heading ("Delete this quote?"), a warning that the action cannot be undone, and two
  buttons: Cancel and Delete (danger). Cancel has the initial focus.
- Cancel, Escape and a click on the backdrop close the dialog and delete nothing. Focus returns to the
  Delete button that opened it.
- Delete in the dialog runs the existing delete action: while it runs the button reads "Deleting..." and
  is disabled; on success the user is redirected with the toast, as before.
- A failed delete keeps the dialog open and shows the error inside it (`role="alert"`); the buttons are
  enabled again.
- The dialog fits 390 px and both themes.

## Random quotes refresh

- While "Get Random Quotes" is pending, the current quotes stay in place, dimmed, with a spinner over
  them; the block keeps its height. The list region is `aria-busy`; the button reads "Loading..." and is
  disabled.
- The error message and the empty result render as before (dimmed too while pending).
- `/random` has the same outer padding as the other pages (the page no longer adds its own `p-4`).

## Scrollbar

- The page does not shift when a scrollbar appears: the stable gutter on `html` is the only mechanism;
  the forced `overflow-y-scroll` on `body` is gone, so a short page has no empty scrollbar track.

## Home page copy

- The three paragraphs under the hero are proofread: grammar and style only, the author's meaning and
  personal tone stay.
