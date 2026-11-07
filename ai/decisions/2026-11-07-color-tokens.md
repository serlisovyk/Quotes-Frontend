# Tailwind CSS with role-named colour tokens

Date: 2026-11-07 · Status: accepted

## Context

Tailwind CSS stays the styling system (it replaces `tailwind-css`). Colours were raw palette classes in
every component, each with its own `dark:` variant: the same grey was written in five places, dark values
drifted, and several pairs failed contrast (input borders, error text, the hover of a tag, the home page
in the dark scheme).

## Decision

- `globals.css` holds the Tailwind import, the colour and duration tokens and the few custom utilities.
  Tokens are named by role, not by hue (`page`, `body`, `muted`, `panel`, `surface`, `accent`, `danger-text`,
  `highlight`, `focus`...). The light values live in `@theme`, the dark values in one block under the `dark`
  variant, which is keyed to `data-theme="dark"`.
- Components use the role utilities only: no raw palette class, no hex value and no `dark:` in `src/`.
- A token exists for a palette role, or for a value used in two places. A fill that looks the same in both
  schemes keeps the same value in both blocks.
- Durations are tokens (`fast`, `base`, `slow`) set to zero once under `prefers-reduced-motion`.
- Every pair is checked for contrast (4.5:1 text, 3:1 controls and borders) in both schemes.
- The look stays the current one; only what failed contrast changed.
- Rejected: per-component `dark:` variants (the drift above); a `prefers-color-scheme` block only (no way to
  choose); the raw palette with a lint rule (names would still say hue, not role); CSS variables outside
  `@theme` (no utilities, so classes could not use them).

## Consequences

- A theme change is a change to one file; a new colour needs both values.
- `THEME_COLORS` (the browser bar, a `<meta>` cannot read a CSS variable) repeats the `panel` values and
  must be changed with them.
