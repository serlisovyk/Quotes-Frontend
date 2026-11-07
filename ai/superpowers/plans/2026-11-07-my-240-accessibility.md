# Plan: accessibility pass (MY-240)

Branch `my-240-accessibility`. Spec: `ai/superpowers/specs/2026-11-07-my-240-accessibility.md`.

## Author's decisions (2026-11-07)

- Visible `label` above every field, placeholder only as an example or removed.
- Mobile menu on a native `<dialog>` with `showModal()`; logic in a hook; jsdom stub in `src/tests/setup`.
- Focus ring on every control, one `h1` per page, contrast only re-checked, 320 px without scroll.

## Decisions made in this plan

- **Author link name:** the dash gets `aria-hidden`, a `sr-only` "Quotes by " precedes the author, so the
  name is "Quotes by <author>" and contains the visible text. The markup repeated in `Quote` and the quote
  page moves into one `AuthorLink` component (real duplication).
- **Home `h1`:** the hero quote block becomes the `h1` (already bold, same classes), so the look stays.
- **Field config:** `label` is a new field of the configs; `placeholder` stays optional, example text only.
- **Backdrop click:** the dialog's content fills it, so a click whose target is the `<dialog>` itself is the
  backdrop.
- **Breakpoint:** an open dialog is closed when `(min-width: 768px)` starts to match, otherwise a modal that
  became `hidden` keeps the page inert. `md:hidden` is not put on the dialog.
- **Button ring:** `focus:` becomes `focus-visible:` with `focus:outline-none` kept as the other controls do.
- **Decision record:** `2026-11-07-accessible-forms-and-menu.md` (native dialog, visible labels, rejected
  alternatives).

## Steps (test first; every red commit is a `test:` on its own)

1. `src/tests/setup/dialog.setup.js`: stub `showModal` / `close` with the browser defaults the tests rely on
   (`open`, `close` event, focus into the dialog, focus back, Escape).
2. Red: `InputField` (label above, `Clear <label>`), forms (labels, `role="alert"`), `Header` (dialog menu),
   home `h1`, header without heading, `AuthorLink`.
3. Green: `InputField` + configs + forms; `useMobileMenu` + `Header` + `BurgerButton`; `AuthorLink` + home
   `h1` + logo; focus rings (`Button`, card and page links).
4. Docs: `definition-of-done`, `react.md`, `map.md`, the decision record and index.
5. Coverage thresholds raised if coverage rose.

## Verification

Format, lint, tests, coverage, build; real Tab / Shift+Tab / Escape on every page at 320, 390 and desktop,
both themes; axe from outside the repo on every page.
