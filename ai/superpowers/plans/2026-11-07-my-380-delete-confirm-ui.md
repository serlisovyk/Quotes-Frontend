# Plan: delete confirmation and UI polish (MY-380)

Branch `my-380-delete-confirm-ui`. Behavior: `ai/superpowers/specs/2026-11-07-my-380-delete-confirm-ui.md`.

## Author's decisions (2026-11-07)

- All four items are agreed. The confirmation is a native `<dialog>` (`accessible-forms-and-menu`).

## Approach

- **Dialog:** `DeleteQuoteButton` keeps its folder; its logic moves into `useDeleteQuoteButton`
  (`dialogRef`, open, close, backdrop click, the `useActionState` of `deleteQuoteAction`), like
  `useMobileMenu`. The trigger is a plain button; the dialog holds a form bound to the action with Cancel
  (first focusable, so it gets the initial focus) and Delete. The dialog has no padding itself, an inner
  `div` does, so a click on the padding is not taken for a click on the backdrop. Classes in a constant.
  The jsdom stub in `tests/setup` already covers `showModal`, `close`, Escape and focus return.
- **Random:** `RandomQuotesRefreshButton` always renders the quotes (or the error) and, while pending,
  dims them and puts a `Loader` over the block; `aria-busy` stays. `min-h-80` keeps the height.
- **Layout:** drop `p-4` from the random page and `overflow-y-scroll` from `body`; `scrollbar-gutter-stable`
  on `html` stays (checked by hand on a short and a long page).
- **Home copy:** edited in `page.jsx`, before and after in the report.

## Commits

1. `docs:` this plan and the spec.
2. `test:` the dialog flow of `DeleteQuoteButton` (red); `feat:` the dialog and its hook.
3. `test:` pending refresh keeps the quotes (red); `fix:` the refresh button.
4. `style:` the double padding and the duplicate scroll class.
5. `test:` / `fix:` home copy.
6. `docs:` map and rule touch-ups.

## Verification

The four checks, then by hand on `npm run dev`: the dialog with Tab, Escape, Enter and the mouse at
desktop width and 390 px in both themes, a real delete of a throwaway quote, `/random` refresh without a
jump, the scrollbar on a short and a long page.
