# Spec: colour tokens, light / dark / system theme (MY-241)

## Behavior

- Every colour of the UI comes from one palette of role-named tokens with a light and a dark value. The
  look stays the current one (violet accent, grey surfaces, yellow search highlight, red danger); only what
  failed contrast changes (see the plan).
- The header has one theme button next to the menu. Each press goes light, dark, system, light. Its
  icon shows the current choice (sun, moon, monitor) and its accessible name says the state and the next
  step ("Theme: System. Switch to Light").
- The choice is kept in the browser (`localStorage`). No saved choice means system, which follows the OS
  setting and changes live with it.
- The page is drawn in the right theme from the first frame on reload, in every choice.
- The browser bar colour (`theme-color`) is the header colour of the active theme, also when the choice
  differs from the OS setting. Toasts follow the active theme.
- Hover, focus and active colours switch with the theme. Durations of transitions are zero under
  `prefers-reduced-motion`.
- The current pagination page looks active (violet, bold) and is exposed as `aria-current="page"`; Prev and
  Next on the ends stay disabled.

## Out of scope

More than two palettes, a per-page theme, a theme animation, a redesign.
