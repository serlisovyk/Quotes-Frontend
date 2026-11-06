# Jest, Testing Library and TDD

Date: 2026-11-06 · Status: accepted

## Context

The project has unit and component tests run by Jest with Testing Library in jsdom through `next/jest`.
The author wants as many tests as possible and a test-first way of working, so that behavior is fixed
before the code that provides it.

## Decision

- Jest + Testing Library remain the test stack; `npm test` is part of verification.
- Work is test-driven: a failing test first, committed on its own as `test:`, then the code that makes it
  pass, then the refactor. A bug starts with a test that reproduces it (`ai/rules/testing.md`).
- Tests sit next to the module they cover and query the UI by role or accessible name; shared mocks and
  helpers live in `tests/mocks` and `tests/utils`.
- Tests are written to the maximum: services, the fetcher, Server Actions, utils, hooks, components and
  pages with logic. Coverage only grows.
- `server-only` is mapped to an empty module in `jest.config.js`, so services can be imported in tests.
- Rejected: writing tests after the code (a test written afterwards describes what the code does, not what
  it must do); leaving coverage unchecked.

## Consequences

- A red or skipped test is never left to make a change pass; a change without a test for its new behavior
  is a review finding.
- Another runner (Vitest) needs the author's explicit ask and a new record. End-to-end tests are rejected
  (`2026-11-06-no-e2e-tests.md`).
