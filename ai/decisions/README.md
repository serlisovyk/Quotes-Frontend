# Decisions

Durable project decisions: why a choice was made, with a date. One decision per file, named
`YYYY-MM-DD-<slug>.md`. Format: a title, a `Date: ... · Status: ...` line, then `Context` → `Decision` →
`Consequences`; short and specific (about 30 lines, `ai/rules/docs.md`), rejected alternatives with their
reason, no check logs.

How this differs from `ai/rules/`: **rules** state what to do now (current law, rewritten as it changes).
**Decisions** state _why_, with a date. A record's text is not rewritten or deleted; only its `Status`
line changes.

The point: an agent (or a human) does not relitigate settled questions or "helpfully" restore something
that was deliberately rejected.

## Status

- `accepted`: in force and built.
- `accepted (not implemented)`: agreed now, built by a later task; that task sets it to `accepted`.
- `superseded by <file>`: replaced by a newer record; its line in the index moves to a Superseded group.

## Changing a decision

A refinement or a reversal is a **new record** that restates what stays in force, so the reader needs
only the newest one. The old record only changes its `Status` line to `superseded by <file>`.

## When to add a record

Propose one as soon as the decision surfaces, without being asked, and only for:

- a standing constraint ("we will not do X", "always / never Y");
- a feature the author deliberately rejected, in a dated record of its own;
- a tradeoff accepted over a named alternative, one a future agent would likely undo;
- a goal agreed now and built later (`accepted (not implemented)`);
- a convention chosen where an obvious alternative existed.

Not decisions: one-off task details, plain current-state facts, a choice nobody would reverse, anything
`ai/rules/` and `ai/map.md` already cover. Do not create noise records.

## Records

### Project and process

- [npm is the package manager](2026-11-06-npm-package-manager.md)
- [JavaScript ESM, no TypeScript](2026-11-06-javascript-without-typescript.md)
- [Merge locally into `main`, no pull requests](2026-11-06-local-merge-without-pr.md)
- [Prettier `endOfLine: auto`](2026-11-06-prettier-end-of-line-auto.md)
- [package.json choices](2026-11-06-package-json-choices.md)
- [Pre-commit hook and CI](2026-11-06-pre-commit-hook-and-ci.md)
- [ESLint stays on 9](2026-11-06-eslint-stays-on-9.md)
- [Naming and structure like the backend](2026-11-06-naming-like-backend.md)
- [Barrels per module, layer-wide only for constants and config](2026-11-06-barrels-per-module.md)
- [No file-watcher polling variables](2026-11-07-no-polling-env-vars.md)
- [Env files never enter an image](2026-11-07-no-env-files-in-image.md)

### Architecture

- [Native Next.js caching instead of TanStack Query](2026-11-06-native-next-caching.md)
- [`API_URL` is server-only](2026-11-06-api-url-server-only.md)
- [No `loading.jsx` above a route that calls `notFound()`](2026-11-06-no-loading-above-not-found.md)
- [Root layout at `src/app`, not in a route group](2026-11-07-root-layout-at-app-root.md)
- [Category suggestions through a Route Handler](2026-11-07-category-suggestions-route-handler.md)

### UI and tests

- [Tailwind CSS with role-named colour tokens](2026-11-07-color-tokens.md)
- [Theme: light, dark or system, set before the first paint](2026-11-07-theme-three-states.md)
- [Visible field labels and a native `<dialog>` for the mobile menu](2026-11-07-accessible-forms-and-menu.md)
- [Sonner toasts for success, inline errors for failures](2026-11-06-toasts-and-inline-errors.md)
- [Vitest, Testing Library and TDD](2026-11-07-vitest.md)
- [Coverage over all of `src/`, thresholds that only go up](2026-11-07-coverage-ratchet.md)
- [No end-to-end tests](2026-11-06-no-e2e-tests.md)

### Superseded

- [Tailwind CSS for styling](2026-11-06-tailwind-css.md): by `color-tokens`
- [Structure and naming conventions](2026-11-06-structure-and-naming.md): by `naming-like-backend`
- [Jest and Testing Library stay](2026-11-06-jest-and-testing-library.md): by `tests-jest-tdd`
- [Jest, Testing Library and TDD](2026-11-06-tests-jest-tdd.md): by `vitest`
