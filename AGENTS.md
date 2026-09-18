# Agent Instructions

This file defines how AI coding agents should work in this repository.

This is a compact Next.js + React frontend for a quotes application. Keep the code practical, accessible, and proportional to the project size. The project is used for frontend learning and portfolio presentation, so clarity, UX polish, and maintainability matter more than clever abstractions.

## Working Principles

- Prefer small, focused changes.
- Follow the existing App Router structure.
- Keep data fetching server-side unless browser interactivity requires a client component.
- Keep API access behind `app/_services`.
- Keep Server Actions focused on mutations, validation results, cache invalidation, and redirects.
- Do not add abstractions unless they remove real duplication or clarify a boundary.
- Keep UI changes responsive, accessible, and consistent with the current visual language.
- Do not introduce TypeScript.
- If a request conflicts with these rules, follow the user's explicit request and mention the tradeoff.

## Project Defaults

- Package manager: npm
- Runtime: Node.js
- Framework: Next.js App Router
- Language: JavaScript ESM
- Styling: Tailwind CSS
- Server mutations: Server Actions
- Notifications: Sonner success toasts, inline errors for failures
- Tests: Jest + Testing Library
- Formatting: Prettier
- API base URL: server-only `API_URL`

## Useful Docs

- `docs/development.md`
- `docs/cache-strategy.md`

## Before Finishing

Run:

```powershell
npm run format:check
npm run lint
npm test
npm run build
```

If formatting was intentionally changed, run `npm run format`.
