# Plan: package.json and Prettier to the standard (MY-219)

Branch `my-219-package-prettier`. Linear issue MY-219, milestone Фундамент, project Quotes. Tooling and
docs only, no behavior change, so there is no spec.

## Author's decisions (2026-11-06)

- `name` is `quotes-client`; description «A quotes app built with Next.js, React, and Tailwind CSS.»
- `engines: { "node": ">=24" }`, no `packageManager`, no `license`, no `keywords`.
- The `docker:*` scripts are removed; the `docker compose` commands live in `README.md` and `ai/map.md`.
- No `prettier-plugin-tailwindcss`: the shared `.prettierrc` with `endOfLine: auto`.
- `.claude` is ignored by Prettier and Jest, so copies in `.claude/worktrees/` stay out of the main
  checkout's checks.
- No `prepare` script and no Husky: that is the next task (MY-221).

## Changes

- `package.json`: field order `name`, `version`, `description`, `author`, `type`, `engines`, `scripts`,
  `dependencies`, `devDependencies`; scripts `dev`, `build`, `start`, `lint`, `lint:fix`, `format`,
  `format:check`, `test`, `test:watch`.
- `.prettierrc`: `endOfLine` becomes `auto`; the other options already match the standard.
- `.prettierignore`: `node_modules`, `package-lock.json`, `.next`, `.swc`, `.vercel`, `out`, `coverage`,
  `.claude`.
- `jest.config.js`: `.claude` in `testPathIgnorePatterns` and `modulePathIgnorePatterns` (`.next` stays).
- `eslint.config.mjs`: `defineConfig` with `globalIgnores` (`.next`, `.claude`, `coverage`), Next config through `extends`, the test override, `react-hooks/set-state-in-effect` off only in `QuoteForm` and `SearchForm`, `eslint-config-prettier` last (new devDependency).
- `npm run format`: if it changes files, a separate `style: apply prettier` commit.

## Decision records

- `2026-11-06-prettier-end-of-line-auto.md`: only the `Status` line (`accepted`) and its index entry.
- One new record for the package choices that a later agent would likely undo (`engines` `>=24`, no
  `docker:*` scripts, no Tailwind Prettier plugin).

## Docs

- `README.md`: Scripts (`lint:fix`, no `docker:*`) and the Docker section (compose commands).
- `ai/map.md`: `package.json` line, the compose commands in Docker.
- `AGENTS.md`: Commands (`lint:fix`; the Docker line now points at the map).
- `ai/workflow.md`, `ai/prompts/*`: checked; they hold no removed script and no end-of-line flag.

## Verification

`npm run format:check` (no flags, on this CRLF checkout), `npm run lint`, `npm test`, `npm run build`.
No browser check: no UI change.
