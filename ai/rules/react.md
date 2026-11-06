# React Rules

Layers, fetching and Server Actions: `ai/rules/architecture.md`. Code style: `ai/rules/style.md`.

## Server and client components

- A component is a server component by default. Add `'use client'` only for state, effects, event
  handlers that need the browser, browser APIs, or hooks such as `useRouter`, `usePathname`,
  `useActionState`.
- Keep the client boundary low: a page stays a server component and renders a small client component for
  the interactive part (`DeleteQuoteButton`, `QuoteForm`, `SearchForm`).
- A server component never imports a client-only library hook; a client component never imports
  `_services` (`server-only` fails the build).
- Props from a server component to a client one are plain serializable data.

## Components

- Function components, one component per file in `app/_components`, default export, file named after the
  component in PascalCase (`QuoteForm.jsx`). Pages and layouts are default exports by the framework's
  contract. Existing files are not renamed or reshaped without a task.
- A file holds its imports and the component, plus at most a small private helper component used only
  there (`PaginationLink`). Constants and lookup tables go to `_config`, pure helpers to `_utils`.
- Props are plain data and callbacks. Callbacks are named `on<Action>` in new code (`onChange`);
  existing `setValues` and `closeMenu` props stay until the component is touched for another reason.
- List keys are stable ids, never an array index.
- Next.js components first: `Link` for navigation, `Image` for images (with `alt`, size and `priority` only
  for the first screen), `next/font` for fonts.

## State and forms

- Prefer no state. Derive values during render; read the URL on the server through `searchParams`
  rather than copying it into state.
- Mutations are forms bound to a Server Action: `<form action={formAction}>` with `useActionState`. The
  action returns the next form state; the component renders its `errors` next to the fields and its
  `formError` above the button, and disables the button while `isPending`.
- A form that must keep what the user typed after a failed submit holds its fields in state, because
  React resets an uncontrolled form after an action.
- Navigation that depends on user input uses `router.push` or `router.refresh` from `useRouter`
  (`SearchForm`, `RandomQuotesRefreshButton`); a pending refresh shows `Loader` through `useTransition`.
- The React Compiler memoizes: no manual `useMemo`, `useCallback` or `memo`.

## Effects

- An effect only synchronizes with something outside React (the URL, the document, a browser API) and
  returns its cleanup when it subscribes to something.
- Work that follows a user action runs in the event handler or the form action, not in an effect that
  watches state. Do not copy props into state with an effect.

## Hooks

- The Rules of Hooks hold; `eslint-config-next` checks them.
- Each kind of hook call is its own paragraph: router and navigation hooks, refs and ids, the `useState`
  block, `useActionState` / `useTransition`. Values derived from them are the next paragraph.
- Logic a component repeats moves into a function in `_utils`; a custom hook only when it wraps hooks.

## Accessibility in components

- Real elements: `<button>` for actions, `<a>` through `Link` for navigation, `<form>`, `<label>`,
  `<input>`. A `div` with `onClick` is a bug.
- Every control has an accessible name: a visible or visually hidden label, or a text content. A
  placeholder alone is not a label.
- A field with an error is marked `aria-invalid` and linked to its message through `aria-describedby`;
  an inline form error is announced (`role="alert"` or a polite live region).
- A disclosure control (`BurgerButton`) exposes `aria-expanded` and `aria-controls`; the navigation has
  an `aria-label`; the skip link stays the first focusable element.
- A change a screen-reader user must hear is announced once: Sonner's toast region already announces
  success toasts, so do not add a second live region for the same event.
- Images have meaningful `alt` text, or an empty one when decorative.
