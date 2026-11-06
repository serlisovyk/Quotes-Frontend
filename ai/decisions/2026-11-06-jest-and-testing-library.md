# Jest and Testing Library stay

Date: 2026-11-06 · Status: accepted

## Context

The project already has unit and component tests: services, utils and components, run by Jest with
Testing Library in jsdom through `next/jest`. Dropping them or moving to another runner was an option.

## Decision

- Jest + Testing Library remain the test stack; `npm test` is part of verification.
- Tests sit in a `__tests__` folder next to what they cover and query the UI by role or accessible name.
- A change to a service, an action, a util or a component keeps its tests green and adds or updates the
  ones it needs.
- `server-only` is mapped to an empty module in `jest.config.js`, so services can be imported in tests.

## Consequences

- A red or skipped test is never left to make a change pass.
- Another runner (Vitest) or an end-to-end framework needs the author's explicit ask and a new record.
