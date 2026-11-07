# Coverage over all of `src/`, thresholds that only go up

Date: 2026-11-07 · Status: accepted

## Context

A report that counts only the files some test imports hides the untested ones: the figure looked high
while whole components had no test. Merges are local, so CI is the only automatic check of the suite.

## Decision

- `npm run test:coverage` (`vitest run --coverage`, provider v8) measures every `.js` and `.jsx` file in
  `src/`. Left out: barrel `index.js` files, `src/tests/**`, test files and `robots.js` (a literal object,
  not worth a test, `ai/rules/testing.md`). Constants, config and route re-exports stay in the report.
- The thresholds in `vitest.config.js` are set per metric (statements, branches, functions, lines) just
  below the measured value, floored to the integer below. They only go up: a task that raises the
  coverage raises them, none lowers them.
- CI runs `npm run test:coverage` instead of `npm test` and fails below the thresholds; `npm test` stays
  without coverage for the fast local loop.
- Rejected: a threshold equal to the measured value (a one-line change would break the build for no
  reason); excluding constants and config (a later real branch would hide there); a coverage service.

## Consequences

- A new module arrives with its tests, or CI fails.
- Raising the thresholds is part of the change that raises the coverage.
