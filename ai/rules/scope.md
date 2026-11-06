# Scope Rules

This is a small portfolio quotes frontend. Improve it without turning it into a larger application
template.

## Do Not Add Without Explicit Request

- TypeScript
- A server-state or state-management library (TanStack Query, SWR, Redux, Zustand, ...)
- A UI kit or component library, CSS Modules, CSS-in-JS, a CSS preprocessor
- A form or validation library; a date library
- A database, an ORM, backend code or a mock server in this repo
- Authentication, analytics
- A service worker or PWA, i18n
- A second package manager's lockfile
- Client-side calls to the backend API

## Dependencies

- Runtime dependencies are `next`, `react`, `react-dom`, `sonner` (toasts) and `react-spinners` (the
  loader). Another one needs the author's explicit yes and, if it is a lasting choice, a decision record.
- Tooling in scope: Prettier, ESLint, Jest + Testing Library, Tailwind CSS, Docker.

## Prefer

- Small, focused improvements to the existing UI
- Accessibility fixes tied to the existing interface
- Keyboard, touch and small-screen improvements
- Performance changes that directly help the app, through native Next.js features

## Tradeoffs

- If a tool adds more maintenance than value, do not add it.
- If an optimization makes the source harder to understand, reconsider it.
- If a change is only useful for a much larger project, leave it out.
