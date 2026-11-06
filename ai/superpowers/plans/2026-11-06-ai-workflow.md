# Plan: AI workflow (MY-217)

Branch `my-217-ai-workflow`. Linear issue MY-217, milestone Фундамент, project Quotes.

## Goal

Give every agent one entry point (`AGENTS.md`) and the project docs in `ai/`, following the
workspace «Стандарт проекта», adapted to Next.js App Router. Replace `docs/`. No app code, no
tooling: this change is docs only, so there is no spec.

## Author's decisions (2026-11-06)

- `docs/cache-strategy.md` becomes a dated record in `ai/decisions/` (native Next.js caching
  instead of TanStack Query) plus a short rule in `ai/rules/architecture.md`.
- `docs/development.md` is split: environment variables and Docker go to `ai/map.md`, commands to
  `AGENTS.md`. Then `docs/` is deleted and `README.md` stops linking to it.
- Decision records (all dated 2026-11-06): npm; JavaScript without TypeScript; Jest + Testing
  Library stay; Tailwind CSS; Sonner toasts for success and inline errors for failures; `API_URL`
  server-only; local merge without a pull request; Prettier `endOfLine: auto`; structure and naming conventions. The record for
  `endOfLine` only documents the decision: the `.prettierrc` change belongs to MY-219.

## Files

- `AGENTS.md`, `CLAUDE.md` — the entry points, written to the standard's structure (project, read
  first, decisions, workflow, skills, working principles, defaults, commands, language,
  verification). Only project facts (stack, env, cache rules, Docker, commands) come from the old
  `AGENTS.md` and `docs/`; their structure and wording are replaced. The architecture content moves to
  `ai/rules/architecture.md`.
- `ai/map.md` — built from the actual files in `app/`, the configs, the env samples and Docker
  files, including what the project does not have.
- `ai/workflow.md` — the 13 steps, local merge, parallel work in worktrees.
- `ai/rules/` — `architecture`, `react`, `style`, `scope`, `docs`, `definition-of-done`.
- `ai/decisions/` — `README.md` index and the records above.
- `ai/skills/` — `README.md`, `feature`, `review`.
- `ai/prompts/` — `README.md`, `orchestrator`, `task` with the Quotes values.
- `ai/linear-task-template.md`, `ai/superpowers/specs/` and `plans/`.
- `.gitignore` — `.claude/worktrees/`.
- `README.md` — a project-structure line for `ai/` and the `docs/` links replaced.
- Removed: `docs/`.

## Approach

- Tests stay: Jest + Testing Library are part of verification and of the `feature` skill.
- The map describes the real tree. Rules, skills and prompts state the standard's conventions
  (kebab-case, role suffixes, barrels, named exports, one alias, role-named colour tokens). The gap is
  one decision record, `structure-and-naming` (accepted, not implemented), and one transition line in
  `style.md`: the tree is moved in a dedicated repo-wide change.
- Commits: plan; entry points and `.gitignore`; map and workflow; rules; decisions and the
  `docs/` removal; skills; prompts and Linear template.

## Verification

- `npm run format:check`, `npm run lint`, `npm test`.
- A script checks that every relative link between `ai/`, `AGENTS.md`, `CLAUDE.md` and `README.md`
  resolves.
- Line and size limits of `ai/rules/docs.md`; no mention of other projects.
- Walk `ai/rules/definition-of-done.md`, then the `review` skill over the diff.
