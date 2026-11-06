# Barrels per module, layer-wide only for constants and config

Date: 2026-11-06 · Status: accepted

## Context

`naming-like-backend` gives every module a folder with an `index.js`. A layer-wide barrel (`@/utils`,
`@/components`) would also be possible, and the layers hold `server-only` code (services) next to code that
client components import.

## Decision

- An import across folders targets one module's folder (`@/utils/query-string`, `@/components/button`).
  `@/constants` and `@/config` are the only layer-wide barrels: flat folders of domain files, imported as a
  whole, none of them server-only.
- A module never imports through its own folder's barrel; a test imports its subject by file.
- `renderQuoteText` and `highlightText` stay functions in `.util.jsx` modules instead of becoming
  components, so callers and tests keep their call shape; making them components is a separate change.
- Rejected: layer-wide barrels. A client component importing `@/utils` would pull every util, and any
  `server-only` module re-exported next to them, into the client bundle.

## Consequences

- ESLint rejects `../` imports and a folder's own barrel; the own-barrel check by alias covers `constants/`
  and `config/`, a component folder is checked by review.
- A new layer folder gets a barrel per module, not one for the layer.
