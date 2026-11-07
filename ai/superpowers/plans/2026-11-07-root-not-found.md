# Plan: root not-found for unknown URLs (MY-339)

Branch `my-339-root-not-found`. Behavior: `ai/superpowers/specs/2026-11-07-root-not-found.md`.

## Author's decisions (2026-11-07)

- Move the root layout out of the route group: `src/app/layout.jsx` and `src/app/not-found.jsx` at the
  root of `src/app`. No `global-not-found`, no experimental flags.
- `agentRules: false` in `next.config.mjs`.
- Parallel with MY-239, which edits the spacing in `not-found.jsx` and `error.jsx`: here they are only
  moved with `git mv`, their content is not touched, so the rebase resolves cleanly.

## Decisions in this plan

- **The `(routes)` group has no purpose left.** It existed only to hold the root layout and does not change
  URLs; with the layout at `src/app` it separates nothing. Every file moves up with `git mv`:
  `layout.jsx`, `globals.css`, `fonts/`, `not-found.jsx`, `error.jsx`, `page.jsx`, `random/`, `search/`,
  `quotes/` and their tests. `layout.jsx` imports `./globals.css` and `./fonts/...` relatively, so those
  move with it and stay beside it.
- **Placement rules stay:** `error.jsx` next to the layout keeps the header and footer on a failed load;
  `loading.jsx` only in `random` and `search` (decision `no-loading-above-not-found`).
- A new decision record: the root layout lives at `src/app`, not in a group, so unknown URLs get our 404;
  `global-not-found` rejected (experimental flag, and it renders without the layout).
- **No `agentRules` instruction found in `ai/`** (grep for `agentRules`, `nextjs-agent-rules`,
  `git checkout AGENTS.md`): nothing to remove.

## Changes

- `git mv` of everything from `src/app/(routes)/` to `src/app/`; the group folder disappears.
- `next.config.mjs`: `agentRules: false`.
- Docs: `ai/map.md` (routes section), `CLAUDE.md` (`src/app/(routes)`), the new decision record and its
  index line.

## Tests

- Red first: `src/app/not-found.test.jsx` (same two cases as the current test, imports `./not-found`)
  fails because the file is not at the root. In the green commit the old test is removed (identical
  content), the layout test moves with the layout.
- The real proof of the routing fix is HTTP, not a unit test: `curl` against the production build
  (`/nope` 404 with our page; `/quotes/abc`, `/quotes/999999999` 404; `/`, `/random`, `/search` 200) and
  `next dev` (`AGENTS.md` untouched, `/nope` shows our page at desktop and 390 px).
