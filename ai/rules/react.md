# React Rules

Why: decisions `naming-like-backend` and `native-next-caching`. Layers, fetching and Server Actions:
`ai/rules/architecture.md`; code style: `ai/rules/style.md`.

## Server and client components

- A component is a server component by default. Add `'use client'` only for state, effects, browser APIs
  or hooks such as `useRouter`, `usePathname`, `useActionState`.
- Keep the client boundary low: a page stays a server component and renders a small client component for
  the interactive part (the form, the delete button, the search form).
- A client component never imports a backend service (`server-only` fails the build); the only service a
  client uses is `category-suggestions`, which calls our own route. Props passed from a server
  component to a client one are plain serializable data.

## Components

- Function components, one per file, in its own folder next to its test, exported by name and re-exported
  by the folder's `index.js` (`components/quote-form/quote-form.jsx`). Pages and layouts are default
  exports by the framework's contract.
- A component file holds only its imports and the component: constants go to `constants/`, pure helpers
  to `utils/`, logic to a hook.
- Props are plain data and callbacks named `on<Action>` (`onChange`, `onClose`). A component that needs
  data from the server receives it as props from its page.
- Up to three props are destructured in the signature. A component with four or more takes `props` and
  destructures it in the first statement of its body, followed by a blank line:
  `const { quote, selectedCategory, searchText, isTruncated } = props`.
- List keys are stable ids, never an array index.
- Use the Next.js components: `Link` for navigation, `Image` for images, `next/font` for fonts.

## State and logic

- Prefer no state. Derive values during render; read the URL on the server through `searchParams`
  instead of copying it into state.
- A component with real logic (a form's fields, submit, focus, a menu's open state) moves it into its own
  hook, `use<Component>` in `hooks/use-<component>/use-<component>.js`, and keeps only the markup. Pure
  utilities are imported directly, no dependency injection.
- Mutations are forms bound to a Server Action: `<form action={formAction}>` with `useActionState`. The
  action returns the next form state; the form renders `errors` next to the fields and `formError` above
  the button, and disables the button while `isPending`.
- React resets an uncontrolled form after every action: a form that keeps what the user typed after a
  failed submit holds its fields in state.
- Navigation that depends on user input uses `router.push` or `router.refresh`; a pending refresh shows
  the loader through `useTransition`.
- The React Compiler memoizes: no manual `useMemo`, `useCallback` or `memo`.

## Effects

- An effect only synchronizes with something outside React (the URL, the document, a browser API) and
  returns its cleanup when it subscribes. A browser value that only feeds the render is read with
  `useSyncExternalStore`, not copied into state by an effect.
- Work that follows a user action runs in the event handler or the form action, not in an effect that
  watches state. Do not copy props into state with an effect.

## Hooks

- A hook has no role suffix: it lives in `hooks/use-<name>/use-<name>.js` with an `index.js` barrel and its
  test, and exports `use<Name>`. The Rules of Hooks hold; `eslint-config-next` checks them.
- A hook is tested through `renderHook` or the component that uses it (`ai/rules/testing.md`).
- Each kind of hook call is its own paragraph: context, refs and ids (`useRef`, `useId`), router and
  browser hooks, the `useState` block, action state (`useActionState`, `useTransition`). Values derived
  from a hook's result form the next paragraph.

## Accessibility in components

- Real elements: `<button>` for actions, `Link` for navigation, `<form>`, `<label>`, `<input>`. A `div`
  with `onClick` is a bug.
- Every field has a visible `<label>` above it, tied by `htmlFor` / `id`; every other control has an
  accessible name from its text or an `aria-label`. A placeholder is only an example of the input, never
  the label.
- A field with an error is marked `aria-invalid` and linked to its message through `aria-describedby`; an
  inline form error is announced (`role="alert"`).
- A disclosure control exposes `aria-expanded` and `aria-controls`. A menu or a confirmation that covers the page is a native
  `<dialog>` opened with `showModal()`: Escape, the inert page and the focus in and back come from the
  browser. The navigation has an `aria-label`; the skip link stays the first focusable element.
- A change a screen-reader user must hear is announced once: Sonner's region already announces success
  toasts, so no second live region for the same event.
- Images have meaningful `alt` text, or an empty one when decorative.
- One `h1` per page, no skipped levels; the logo is not a heading. A link whose text is a dash and a name
  gets an `aria-label` that says where it goes.
