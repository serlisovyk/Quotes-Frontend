# ESLint stays on 9

Date: 2026-11-06 · Status: accepted

## Context

ESLint 10 is out. `eslint-config-next` itself allows `eslint >=9.0.0`, but the plugins it bundles
(`eslint-plugin-react`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`) declare ESLint only up to 9.
With ESLint 10 the lint run passes, yet `npm ls eslint` reports those peers as `invalid`.

## Decision

- `eslint` stays on the latest 9.x (`^9.39.5`), with a peer tree that `npm ls` reports clean.
- Rejected: ESLint 10 with npm `overrides` forcing the peers (hides a mismatch the plugin authors have
  not signed off on).
- Rejected: ESLint 10 with a permanent `invalid` peer warning (noise that hides real problems and makes
  `npm ls` fail).

## Consequences

- `npm outdated` lists `eslint` as the one deliberately deferred major.
- Move to ESLint 10 once those plugins declare it: check on the next dependency update, then add a new
  record that supersedes this one.
