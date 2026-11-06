# Pre-commit hook and CI

Date: 2026-11-06 · Status: accepted

## Context

Checks used to run only by hand. Merges are local (decision `local-merge-without-pr`), so a gate in a pull
request is not available. The backend is a separate service, and the build renders pages that call it.

## Decision

- Pre-commit: Husky runs lint-staged, which runs `eslint --fix` and `prettier --write` on staged
  sources and `prettier --write` on staged styles, JSON, Markdown and YAML. A hook failure is fixed,
  never skipped with `--no-verify`.
- CI: one GitHub Actions workflow on every push runs `npm ci`, lint, format check, tests and build. It is
  a signal after the push, not a merge gate; a red `main` is fixed at once.
- The CI build uses the real `API_URL` and `SITE_URL` from GitHub Secrets, which the author adds by hand.
- ESLint fails `process.env.API_URL` and the global `fetch` outside `app/_services`, so the boundary of
  `API_URL` is checked automatically. Rejected for CI: a mock backend or a placeholder URL, which would
  build pages that cannot show how they behave against the real API.

## Consequences

- CI goes red when the backend is down or slow, even if the code is fine: check the backend before
  looking for a bug.
- The secrets are a repository setting, not code: a new clone or fork has none and its CI build fails.
