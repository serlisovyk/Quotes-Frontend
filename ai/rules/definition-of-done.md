# Definition of Done

A change is done when all of the following hold. Use it as the gate before handing a change over for
approval.

## Code

- New code follows `ai/rules/architecture.md`, `ai/rules/react.md` and `ai/rules/style.md`: the layer that
  owns it, server components by default, API access only through the services; kebab-case files with
  singular role suffixes (none on components and hooks), a folder with an `index.js` per module, named
  exports, one component per file, imports through `@/` in the order `ai/rules/style.md` sets.
- `API_URL` is read only in the services; nothing server-only reaches a client component.
- A Server Action validates on the server, returns form state for failures, revalidates the affected
  pages and redirects outside any `try` / `catch`.
- Every read a page renders has a failure path that shows an inline message; a missing item shows the
  not-found message.
- Shared values come from `constants/`; no magic numbers in components.
- No comments, no inline styles; colours only through the role-named theme tokens, in light and dark.
- Stale code, classes and constants left behind by the change are removed.
- Nothing from `ai/rules/scope.md` slipped in.

## Accessibility

- Controls are real elements (`<button>`, `<input>`, `<form>`, `Link`) with an accessible name; a
  placeholder is not a label.
- Everything works from the keyboard, the focus indicator is visible, and after an action the focus lands
  somewhere meaningful.
- Text contrast is at least 4.5:1, controls and borders at least 3:1, in light **and** dark color schemes
  and in every state, hover and disabled included.
- A field error and a form error are announced; success is announced by the Sonner toast, once.
- Touch targets are comfortable (about 44 px); the layout works from 320 px wide to desktop and at 200%
  zoom with no horizontal scroll, and is checked at 390 px.
- Images have `alt` text; motion respects `prefers-reduced-motion`.

## Tests

- The change was test-driven (`ai/rules/testing.md`): its failing test was committed first as its own
  `test:` commit, and a bug fix started with a test that reproduces the bug.
- New or changed behavior in a service, the fetcher, an action, a util, a hook, a component or a page with
  logic has a Jest test next to the module that fails without the change; tests query by role or
  accessible name, as a user would.
- `npm test` is green, coverage did not drop, and no test was deleted or skipped to make it pass.

## Docs (in the same change, within `ai/rules/docs.md`)

- `README.md`: a short line, only if what a user sees, the scripts or the structure changed.
- `ai/map.md`: only if a file, folder, route, environment variable or script was added, renamed or
  removed.
- `ai/rules/*` or `ai/skills/*`: only if the change reshaped a pattern.
- `ai/decisions/`: a new dated record if the change meets the criteria in its `README.md`.
- No doc went over its limit; one that did was trimmed in this change.

## Verification

- Every check listed under "Verification" in `AGENTS.md` passes.
- A change to code or UI was used in the browser against the live API, at desktop width and at 390 px,
  with keyboard and mouse, including its loading, empty and error states, not just built.
- Reported: what changed, which commands were run, whether they passed, and anything that could not be
  verified. Never claim the project builds, lints or passes tests unless the command was run and passed.
