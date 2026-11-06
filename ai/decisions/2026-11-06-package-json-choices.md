# package.json choices

Date: 2026-11-06 · Status: accepted

## Context

`package.json` follows the workspace standard (fields, order, script names). Three choices a later
agent would be tempted to undo are fixed here.

## Decision

- `engines.node` is `>=24`; there is no `packageManager` field (npm is already fixed by its own record).
- No `docker:*` scripts: the `docker compose` commands are written out in `README.md` and `ai/map.md`.
  Each script only wrapped one command, and the standard fixes the script names.
- No `prettier-plugin-tailwindcss`: the shared `.prettierrc` is used as it is.

## Consequences

- The Dockerfiles still use `node:20-alpine`; bringing them to Node 24 is a separate change.
- Class order in `className` is not enforced by Prettier.
- Rejected: keeping the `docker:*` scripts (non-standard names, a second place that lists the commands)
  and the Tailwind plugin (an extra dependency and a config option the shared file does not carry).
