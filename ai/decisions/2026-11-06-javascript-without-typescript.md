# JavaScript ESM, no TypeScript

Date: 2026-11-06 · Status: accepted

## Context

The app is a compact frontend used for learning and portfolio presentation. TypeScript is the common
alternative for a Next.js app, and it adds a compiler configuration, type declarations and a layer of
syntax to a codebase this small.

## Decision

- JavaScript ESM in `.js` and `.jsx` files.
- No TypeScript, no `tsconfig.json`, and no JSDoc types as a substitute (code has no comments).
- `jsconfig.json` exists to teach editors the path aliases.

## Consequences

- A request that implies TypeScript reverses this record and needs the author's explicit ask and a new
  dated record.
- Contracts between layers are kept by validation at the boundary (the validation utils), by tests and
  by the rules.
