# Structure and naming conventions

Date: 2026-11-06 · Status: accepted (not implemented)

## Context

The current tree has PascalCase component files in one flat folder, camelCase modules, default exports,
six path aliases and tests in `__tests__` folders. The author's code style standard asks for another
shape, so the repo follows the standard.

## Decision

- Files and folders are kebab-case; a non-component file carries a role suffix (`*.constants.js`,
  `*.utils.js`, `*.service.js`, `*.action.js`). Next.js-mandated names stay (`page.jsx`, `layout.jsx`,
  `not-found.jsx`, `robots.js`).
- Every component has a folder of its own with an `index.js` barrel; one component per file, no exception.
- Named exports only; route files keep the default export Next.js requires.
- One alias, `@/`, for the sources; import order is packages, `@/` (with `@/constants` last), `./`, styles.
- Constants live in the file of their domain, general helpers in their own utils file.
- A test sits next to the module it covers.
- Colours go through role-named theme tokens with light and dark values.
- Rejected: keeping PascalCase files and the six aliases. It leaves the repo on its own conventions
  instead of the shared ones.

## Consequences

- The tree is moved in one dedicated repo-wide change; other tasks do not rename files, and a new file
  follows its neighbours until then. `ai/map.md` shows the tree as it is.
- The change that moves the tree sets this record to `accepted` and updates the map.
