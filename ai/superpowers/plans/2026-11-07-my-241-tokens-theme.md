# Plan: colour tokens, light / dark / system theme (MY-241)

Branch `my-241-tokens-theme`. Linear MY-241, milestone Рефакторинг. Spec:
`ai/superpowers/specs/2026-11-07-my-241-tokens-theme.md`. Touches almost every component: runs alone.

## Author's decisions (2026-11-07)

- Palette is the current look on role-named tokens in Tailwind v4 `@theme` (`globals.css`), light and dark
  values; only failing contrast (4.5:1 text, 3:1 UI) changes, each change listed with ratios.
- No raw palette classes and no scattered `dark:` in components or constants; the theme switches tokens.
- Token set stays small: the palette plus values shared by two or more places.
- Theme switcher light / dark / system, choice in `localStorage`, an inline script in `<head>` sets
  `data-theme` before paint, `suppressHydrationWarning` on `<html>`, Tailwind dark variant keyed to
  `data-theme` (`@custom-variant`), `themeColor` for light and dark, the switch keeps the meta in step.
- Switch in the header: a real `<button>`, keyboard accessible, accessible name states the current choice.
  Logic in a hook; storage key and theme names in `constants`.
- Durations are tokens, zeroed once under `prefers-reduced-motion`.
- TDD: theme helpers, hook and switch get failing tests first.

## Decisions made in this plan

- **One cycle button** (light, dark, system) instead of three buttons: three do not fit next to the logo
  and burger at 390 px, and one button needs no roving focus.
- **The `<html data-theme>` is always `light` or `dark`** (the resolved theme); "system" lives only in
  storage and the hook. The tokens have one dark block, `:root` with `@variant dark`, so a dark value is
  written once. Without JavaScript the page is light.
- **The head script is generated from the constants** (`getThemeInitScript`) and inlined in the layout,
  so the key and names cannot drift apart; a unit test evaluates it.
- **The hook has no state of its own:** the choice is read with `useSyncExternalStore` from storage
  (plus a `storage` event and an in-page listener), the OS preference from `matchMedia`; an effect writes
  `data-theme` and `theme-color`. Header and toasts both call it.
- **`theme-color`** is the header colour (`panel`), not the page colour: white and `#1f2937`.
- **Token set** (light / dark): `page`, `body`, `muted`, `panel`, `surface`, `surface-hover`, `line`,
  `accent`, `accent-hover`, `accent-text`, `secondary`, `secondary-hover`, `danger`, `danger-hover`,
  `danger-text`, `highlight`, `tag`, `tag-hover`, `chip`, `chip-hover`, `on-solid`, `on-pale`, `on-chip`,
  `link-hover`, `focus`, `overlay`; durations `fast` 200, `base` 300, `slow` 500 ms. Fills that look the
  same in both themes (buttons, tags) keep one value in both blocks.
- **Consolidations** (values shared by two places): the muted text (status message, author, quote
  detail), the focus ring (was blue and two violets), the selected tag and the search highlight.
- **Contrast changes** (before to after, ratio): input border 1.47 to 4.83 light, 2.62 to 7.80 dark;
  clear icon 2.54 to 7.56; error text 3.76 to 6.47 light; tag hover 3.34 to 6.70; author hover 4.17 to
  5.41; home blurb 2.98 to 7.56; home heading in dark 1.81 to 10.72; home author line in dark 3.47 to
  10.72. The full table goes in the report.
- **Pagination:** `PaginationLink` checks `isActive` before `isDisabled`, and `Pagination` stops
  passing `isDisabled` for the current page. The active look is the accent fill with bold text.
- `ai/decisions`: a record for the tokens and one for the theme with the head script; the Tailwind
  record is superseded because its "dark: variants" consequence no longer holds.

## Steps (test first, one commit per step)

1. `docs:` this plan and the spec.
2. `test:` theme helpers (parse, resolve, next, init script, apply, storage). `feat:` them + constants.
3. `test:` `useTheme`. `feat:` the hook.
4. `test:` `ThemeSwitch`. `feat:` the component, the header, `AppToasts` theme, layout (script,
   `suppressHydrationWarning`, viewport colours).
5. `test:` pagination active look. `fix:` it.
6. `test:` raw-class assertions to token classes (button, status message, quote highlight).
   `refactor:` tokens in `globals.css`, then components, constants and pages on tokens, durations.
7. `docs:` style rule, map, decisions, README.

## Verification

The four checks plus `test:coverage` (thresholds raised if coverage rises); the greps for raw palette
classes and `dark:`; the browser per `AGENTS.md` in both themes, system following the OS, keyboard, no
flash on reload, the `theme-color` meta, 390 px.
