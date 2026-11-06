# npm is the package manager

Date: 2026-11-06 · Status: accepted

## Context

The project was scaffolded with npm, and its Dockerfiles and compose scripts install with `npm ci`.

## Decision

- `npm` for every install and script; `package-lock.json` is the only lockfile.
- Installs from the lockfile use `npm ci`.

## Consequences

- Commands in the docs, prompts and Linear issues are `npm ...`.
- A `pnpm-lock.yaml` or `yarn.lock` that appears is a mistake: remove it.
- Switching to another manager is a new record and changes the Dockerfiles in the same task.
