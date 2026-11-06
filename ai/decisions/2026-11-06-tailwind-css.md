# Tailwind CSS for styling

Date: 2026-11-06 · Status: accepted

## Context

The UI is built from small components, and the project's visual language is a handful of colors, spacing
and breakpoints. Plain CSS files, CSS Modules and CSS-in-JS were the alternatives.

## Decision

- Tailwind CSS 4 (through `@tailwindcss/postcss`) styles the UI with utility classes in `className`.
- `globals.css` holds the Tailwind import, the base light and dark colors and the few custom utilities
  that classes cannot express.
- Rejected: CSS Modules and CSS-in-JS. A second styling system next to the utilities would split the
  look of the app across two places.

## Consequences

- Long class strings are shared as constants or variant maps (`Button`), not duplicated.
- Dark color scheme support is part of every colored class (`dark:` variants).
- A UI kit or another styling system needs the author's explicit ask and a new record.
