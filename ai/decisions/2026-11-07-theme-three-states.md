# Theme: light, dark or system, set before the first paint

Date: 2026-11-07 · Status: accepted

## Context

The dark scheme followed only the operating system, and the browser bar was always white. The author wants
a choice of light, dark or system, with no flash of the wrong theme on load.

## Decision

- One button in the header cycles light, dark, system. Its icon shows the choice and its accessible name
  says the state and the next step. The choice is saved in `localStorage`; nothing saved means system, which
  follows the OS live.
- `<html data-theme>` always holds the resolved theme (`light` or `dark`); "system" exists only in storage
  and in `useTheme`. The tokens react to `data-theme` (`ai/decisions/2026-11-07-color-tokens.md`).
- An inline script in the root layout `<head>` sets `data-theme` before the body is parsed. It is generated
  from the theme constants (`getThemeInitScript`), so the key and the names cannot drift apart, and
  `suppressHydrationWarning` on `<html>` covers the attribute React did not render. A blocking script is the
  only way to avoid a flash: React starts after the first paint.
- `useTheme` reads the choice and the OS preference with `useSyncExternalStore` and writes `data-theme` and
  every `theme-color` meta. The metas come from `viewport` (one per scheme, so the bar is right without
  JavaScript); when the choice differs from the OS the hook overwrites both, and re-applies after Next
  replaces them on a client navigation. Toasts get the resolved theme.
- Rejected: three buttons (they do not fit beside the logo and burger at 390 px); a two-state toggle (system
  could not be picked again); setting the theme from an effect (one frame in the wrong theme); a deferred
  or module script (runs after the paint); a `prefers-color-scheme` block alone (no choice).

## Consequences

- The head script is the one direct `localStorage` read outside `theme-storage`.
- Without JavaScript the page is light; with a blocked storage the choice lasts until the page closes.
