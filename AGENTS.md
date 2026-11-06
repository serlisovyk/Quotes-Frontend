# Agent Instructions

This is the canonical instruction file for **every** AI agent working in this repo. `CLAUDE.md` and
any other tool-specific entry point point here: keep shared knowledge in `ai/`, not duplicated per
tool.

## Project

A compact Next.js (App Router) + React frontend for a quotes application: browse, search, create,
edit and delete quotes. The data lives in a separate backend API. JavaScript ESM, Tailwind CSS, Server
Actions, Sonner toasts, Jest + Testing Library. No TypeScript. Keep the code practical, accessible and
proportional to the project size; clarity, UX polish and maintainability matter more than clever
abstractions.

- Repo: <https://github.com/serlisovyk/Quotes>
- Backend repo: <https://github.com/serlisovyk/Quotes-Backend>
- Tasks: Linear, project **Quotes** (team `MY`, issues `MY-<n>`, label `Frontend`)

## Read First

- `ai/map.md`: where files live, the environment variables, Docker, what the project deliberately
  does **not** have. Read it before exploring the code from scratch.
- The rules of the area you touch, in `ai/rules/`: `architecture.md` and `react.md` for code,
  `style.md` for code style and Tailwind, `scope.md` for what not to add without an explicit request.
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
- Tests are Jest + Testing Library: a change to a service, an action, a util or a component keeps its
  tests green and adds or updates the ones it needs.

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
- Follow the existing App Router structure.
- Keep data fetching server-side unless browser interactivity requires a client component.
- Keep API access behind `app/_services`.
- Keep Server Actions focused on mutations, validation results, cache invalidation and redirects.
- Do not add abstractions unless they remove real duplication or clarify a boundary.
- Do not rewrite working code just to make it look different.
- Keep UI changes responsive, accessible and consistent with the current visual language.
- Do not introduce TypeScript.
- If a request conflicts with these rules, follow the user's explicit request and mention the
  tradeoff.

## Project Defaults

- Package manager: `npm`; `package-lock.json` is the only lockfile.
- Stack: Next.js App Router, React with the React Compiler, JavaScript ESM, Tailwind CSS 4.
- Server mutations: Server Actions. Notifications: Sonner success toasts, inline errors for failures.
- Tests: Jest + Testing Library. Formatting: Prettier (`.prettierrc`); `npm run format` applies it.
- API base URL: server-only `API_URL`.

## Commands

```bash
npm ci               # install from the lockfile
npm run dev          # dev server on port 4000
npm run build        # production build
npm run start        # serve the production build
npm run test:watch   # Jest in watch mode
npm run format       # apply Prettier
```

Docker scripts (`docker:up`, `docker:down`, `docker:dev`, `docker:dev:down`) are described in
`ai/map.md`.

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
cannot be run, report that clearly.
