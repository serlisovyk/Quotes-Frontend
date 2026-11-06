# Plan: testing rules, TDD and naming like the backend (MY-327)

Branch `my-327-testing-naming-rules`. Linear issue MY-327, milestone Фундамент, project Quotes. Docs only
(`ai/`, `AGENTS.md`), no change in `app/`, so there is no spec. The renaming itself is MY-238; the missing
tests and the coverage threshold are MY-242.

## Author's decisions (2026-11-06)

- Modules carry a singular role suffix; components and hooks carry none.
- One alias, `@/`. E2E tests are rejected: Jest + Testing Library only. TDD, and as many tests as possible.

## Decided in this plan

- **Roles** (suffix, singular): `.service.js`, `.fetcher.js`, `.action.js`, `.util.js`, `.constant.js`,
  `.config.js`, `.error.js`, `.mock.js`, `.test.js` / `.test.jsx`. `.config.js` is for configuration that
  reads the environment or describes the site; plain values are `.constant.js`.
- **Hooks** live in a shared `hooks/` folder, one folder per hook (`hooks/use-quote-form/use-quote-form.js`
  plus `index.js`), like every other module; this replaces "next to its component" in `react.md`.
- **Test helpers**: `tests/mocks/<name>/<name>.mock.js` and `tests/utils/<name>/` in the sources root, each
  with an `index.js`.
- **Decision records**: one new record for the naming scheme (supersedes `structure-and-naming`), one new
  record for tests (supersedes `jest-and-testing-library`, adds TDD and "as many as possible"), one record
  that end-to-end tests are rejected. The old records change only their `Status` line.
- **TDD in the workflow**: inside Implement (step 6), so the 13 steps stay; a failing test is committed
  first as `test:`, then the code, then the refactor.
- `ai/rules/architecture.md` is not touched (MY-235 edits it); nothing in it needs to change for this task.

## Changes

- `ai/decisions/`: the three new records, the two old `Status` lines, the index (Superseded group).
- `ai/rules/testing.md`: new, modelled on the backend's rule, adapted to Next.js and Testing Library.
- `ai/rules/style.md`, `react.md`, `definition-of-done.md`: singular suffixes, hooks, `tests/`, TDD line.
- `ai/workflow.md`, `ai/prompts/task.md`, `ai/prompts/orchestrator.md`, `ai/linear-task-template.md`: TDD.
- `ai/skills/feature.md`, `AGENTS.md`: the new scheme, `testing.md` in Read First.
- `ai/map.md` is not touched: the tree does not change until MY-238.

## Verification

`npm run format:check`, `npm run lint`, `npm test`; every relative link in `ai/` resolves; the whole diff
is read against `ai/rules/docs.md` (limits, no history, no other projects).
