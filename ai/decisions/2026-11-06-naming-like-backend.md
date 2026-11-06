# Naming and structure like the backend

Date: 2026-11-06 · Status: accepted

## Context

The current tree has PascalCase component files in one flat folder, camelCase modules, default exports, six
path aliases and `__tests__` folders; the previous record asked for plural role suffixes. The backend repo
of this product uses singular suffixes, and the author wants the two repos to read alike.

## Decision

- Files and folders are kebab-case. A module carries its role as a singular suffix: `.service.js`,
  `.fetcher.js`, `.action.js`, `.util.js`, `.constant.js`, `.config.js`, `.error.js`, `.mock.js`,
  `.test.js` / `.test.jsx`.
- Components and hooks carry no suffix: `components/quote-form/quote-form.jsx`,
  `hooks/use-quote-form/use-quote-form.js`. Next.js-mandated names stay (`page.jsx`, `layout.jsx`,
  `not-found.jsx`, `robots.js`, `sitemap.js`).
- Every module, utils included, has a folder of its own with an `index.js` barrel
  (`utils/escape-reg-exp/escape-reg-exp.util.js`); one component per file, no exception.
- A test sits next to the module it covers (`<module>.test.js[x]`); shared mocks and test helpers live in
  `tests/mocks` and `tests/utils`.
- Named exports only; route files keep the default export Next.js requires.
- One alias, `@/`, for the sources (the backend's `#` imports do not exist here); import order is
  packages, `@/` (with `@/constants` last), `./`, styles.
- Constants live in the file of their domain, general helpers in their own util module; colours go
  through role-named theme tokens with light and dark values.
- Rejected: plural suffixes, a suffix on components and hooks, keeping PascalCase files and six aliases.

## Consequences

- The tree is moved in one dedicated repo-wide change; other tasks do not rename files, and a new file
  follows its neighbours until then. `ai/map.md` shows the tree as it is.
- The change that moves the tree sets this record to `accepted` and updates the map.
