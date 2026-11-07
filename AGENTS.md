# Agent Instructions

This is the canonical instruction file for **every** AI agent working in this repo. `CLAUDE.md` and
any other tool-specific entry point point here: keep shared knowledge in `ai/`, not duplicated per
tool.

## Project

A compact Next.js (App Router) + React frontend for a quotes application: browse, search, create,
edit and delete quotes. The data lives in a separate backend API. JavaScript ESM, Tailwind CSS, Server
Actions, Sonner toasts, Vitest + Testing Library. No TypeScript. Keep the code practical, accessible and
proportional to the project size; clarity, UX polish and maintainability matter more than clever
abstractions.

- Repo: <https://github.com/serlisovyk/Quotes-Frontend>
- Backend repo: <https://github.com/serlisovyk/Quotes-Backend>
- Tasks: Linear, project **Quotes** (team `MY`, issues `MY-<n>`, label `Frontend`)

## Read First

- `ai/map.md`: where files live, the environment variables, Docker, what the project deliberately
  does **not** have. Read it before exploring the code from scratch.
- The rules of the area you touch, in `ai/rules/`: `architecture.md` and `react.md` for code,
  `testing.md` for tests and the test-first way of working, `style.md` for code style and Tailwind,
  `scope.md` for what not to add without an explicit request.
- `ai/rules/definition-of-done.md`: the gate before a change is handed over; `ai/rules/docs.md`: one
  fact one home, size limits, no history in docs.
- `ai/superpowers/` is the archive of past plans and specs: read only the plan or spec of the feature
  you change.

## Decisions

`ai/decisions/` records durable decisions and **why** they were made. Start from its `README.md`
index and read the records of what you touch before proposing to change or "restore" anything: rules
say what to do now, decisions say why. Reversing one means a new dated record, not editing the old
one. Propose a new record, without being asked, when a decision meets the criteria in that
`README.md`.

## Workflow

`ai/workflow.md` is the end-to-end flow for a Linear task: orient, plan (+ spec when behavior
changes), implement, docs, verify, Definition of Done, self-review, report, author approval, local
merge into `main`.

The parts that never bend:

- Never commit task work directly on `main`: use a `my-<n>-<slug>` branch.
- Write a **plan** for anything non-trivial, and a **spec** when observable behavior changes, under
  `ai/superpowers/`: one commit, before any code.
- Nothing is merged and no issue is marked `Done` without the author's explicit approval.
- Merges happen locally into `main`, then `main` is pushed. No pull requests, and never a force-push
  of `main`.
- Never bypass a git hook (`--no-verify`).
- Tests are Vitest + Testing Library only (no end-to-end), written first: a failing test committed as its
  own `test:` commit, then the code, then the refactor; a bug starts with a test that reproduces it. A
  change to a service, an action, a util, a hook or a component keeps its tests green, and coverage
  only grows.

Prompts to start agent sessions live in `ai/prompts/` (index in `ai/prompts/README.md`):
`orchestrator.md` runs several tasks from one session, `task.md` runs a single task. Linear issues
follow `ai/linear-task-template.md`.

## Skills

Playbooks live in `ai/skills/` (plain Markdown, index in `ai/skills/README.md`):

- `feature`: the path of a feature through service, Server Action, component and test.
- `review`: self-review for regressions, scope creep, accessibility and docs drift.

If a change materially reshapes a pattern, update the matching skill in the same change
(`ai/rules/docs.md`).

## Working Principles

- Prefer small, focused changes.
- A feature lands in the layer that owns it (`ai/rules/architecture.md`): data on the server through
  services, mutations in Server Actions, pure logic in utils, interactivity in small client
  components.
- Follow the existing folder structure, file naming and patterns.
- Do not add new abstractions unless they remove real duplication or clarify a boundary.
- Do not rewrite working code just to make it look different.
- Keep UI changes responsive, accessible, and consistent with the current visual language.
- If a request conflicts with these rules, follow the user's explicit request and mention the
  tradeoff.

## Project Defaults

- Package manager: `npm`, never pnpm or yarn; keep `package-lock.json`, no other lockfile.
- Stack: Next.js App Router, React 19 with the React Compiler, JavaScript ESM (`.js`, `.jsx`), Tailwind
  CSS 4, Sonner for toasts.
- Sources: `src/` (alias `@/`); the build output is `.next/`.
- Tests: Vitest + Testing Library, next to the module they cover; shared mocks and helpers in
  `tests/mocks`, `tests/utils`; TDD (`ai/rules/testing.md`).
- Naming: kebab-case, a singular role suffix per module (`.service.js`, `.util.js`), none on components
  and hooks, a folder with an `index.js` per module, one alias `@/` (`ai/rules/style.md`).
- Formatting: Prettier (`.prettierrc`); `npm run format` applies it. Linting: ESLint flat config, which
  also fails `API_URL` and the global `fetch` outside `src/services`.
- Pre-commit: Husky runs lint-staged (`eslint --fix` and `prettier --write` on staged files); fix what
  it reports.
- CI: GitHub Actions (`.github/workflows/ci.yml`) on every push runs lint, format check, tests and
  build, the build with `API_URL` and `SITE_URL` from GitHub Secrets.
- Environment: server-only `API_URL`; the rest is in `ai/map.md`.

## Commands

```bash
npm ci               # install from the lockfile
npm run dev          # dev server on port 4000
npm run build        # production build
npm run start        # serve the production build
npm run test:watch   # Vitest in watch mode
npm run lint:fix     # ESLint with --fix
npm run format       # apply Prettier
```

The `docker compose` commands are in `ai/map.md`.

## Language

- Chat with the author in Russian.
- Code, commit messages, specs, plans, prompts and `ai/` docs stay in English.
- Linear issues are written in Russian, following `ai/linear-task-template.md`.

## Verification

Run before handing over any change:

```bash
npm run format:check
npm run lint
npm test
npm run build
```

Then use the change in the browser (`npm run dev`, with `API_URL` pointing at the live API): desktop
width and 390 px wide, keyboard and mouse. A green build does not prove a UI change works. If a check
cannot be run, report that clearly. CI runs the same four checks on every push; after a push to
`main`, wait for it to go green.
