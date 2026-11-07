# Visible field labels and a native `<dialog>` for the mobile menu

Date: 2026-11-07 · Status: accepted

## Context

The fields used the placeholder as their only caption (the `<label>` was `sr-only`), so the caption vanished
while typing. The mobile menu was a `div` and an overlay `button`: no Escape, no focus move in or back, and the
page behind stayed reachable with Tab.

## Decision

- Every field has a visible `<label>` above the input, tied by `htmlFor` / `id`. A placeholder is only an
  example of the input ("e.g. courage") or absent.
- The mobile menu is a native `<dialog>` opened with `showModal()`. The browser gives Escape, the inert page,
  focus into the menu and back to the burger; the code adds backdrop click, link click and closing when the
  window grows to `md`. The burger keeps `aria-expanded` and `aria-controls`.
- jsdom has no `showModal` / `close`: one stub with the browser defaults lives in `src/tests/setup`, not in
  each test. Tests prove our wiring; the browser behaviour itself is checked by hand.
- Rejected: floating labels (the caption still moves and shrinks, more code for the same result); `inert` on
  the page plus a hand-written focus trap and Escape handler (re-implements what `<dialog>` does and drifts
  from it); a focus-trap library (a dependency for a native feature).

## Consequences

- A new field needs a `label` in the field config.
- A new full-page overlay is a `<dialog>` too, not a positioned `div`.
