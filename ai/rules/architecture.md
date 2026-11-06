# Architecture Rules

Sources live in `src/` (Next.js App Router, `@/` is its alias); `src/app` holds only the route files. `ai/map.md` says
where every folder lives; `ai/rules/react.md` covers components and hooks.

## Layers

Data flows one way: constants and utils → services → pages and Server Actions → components. Each folder
has one job (decision `naming-like-backend`):

| Layer         | Owns                                                                | Must not                                 |
| ------------- | ------------------------------------------------------------------- | ---------------------------------------- |
| `constants/`  | shared values: routes, limits, cache seconds, field definitions     | import from another layer                |
| `utils/`      | pure helpers: validation, query strings, form and action state      | call the API or read `process.env`       |
| `services/`   | every backend call, behind `server-only`                            | know about React or the UI               |
| `actions/`    | Server Actions: mutation, validation result, revalidation, redirect | render UI                                |
| `components/` | markup, styles and local interactive state                          | import services, read `API_URL`          |
| route files   | pages and layouts: fetch on the server, pass data down              | hold logic a util or a service could own |

## Data fetching

- A client component that calls `useSearchParams` gets its own `<Suspense fallback={null}>` boundary, as
  small as possible, never around a layout's body: without it, or with a boundary around the whole page,
  Next.js prerenders a spinner instead of the page content.
- Fetch on the server, in a page, a layout or a server component. A component is a client component
  (`'use client'`) only when it needs state, effects, browser APIs or hooks such as `useRouter`; keep it
  as small as possible and pass it data as props.
- Every API call goes through a service: the fetcher builds the URL from `API_URL`, the quotes service
  exposes one function per endpoint. A page or an action never calls `fetch` itself.
- `API_URL` is server-only: never prefix it with `NEXT_PUBLIC_`, never read it outside the services.
  ESLint enforces both: `API_URL` and the global `fetch` fail outside `services/`, tests included.
- A read that a page renders returns a result the page can show (`{ quotes, hasError }`), so a backend
  failure becomes an inline message, never a crashed page. A read that returns `null` for a missing item
  lets the page render its not-found message.
- A page that needs one item tells "missing" from "failed": a missing item (an invalid id, an API 404)
  calls `notFound()`, a failure is thrown and caught by `error.jsx`. The home card is optional and
  swallows both.
- Validate what comes from the URL (the id, the allowed search params) before it reaches the API.

## Server Actions

- A Server Action does one mutation, in this order: validate the form data, call a service, revalidate,
  redirect.
- Validation runs on the server through the validation utils, and the action returns the form state
  (`values`, `errors`, `formError`) instead of throwing; an API failure is turned into the same state.
- After a successful mutation the action calls `revalidatePath` for every public page that shows the
  quote, then `redirect`s. `redirect` works by throwing, so it is never inside a `try` / `catch`: the `try`
  holds only the service call, and `revalidatePath` and `redirect` follow it.
- Success is told with a `?toast=<type>` query parameter that the toasts component turns into a Sonner
  toast and then removes from the URL; a failure is an inline message next to the form or the button
  (decision `toasts-and-inline-errors`).

## Caching

- Time-based revalidation for a stable page: home and quote details. `cache: 'no-store'` for search,
  random and the edit page's read.
- Every mutation calls `revalidatePath` for the pages it can change.
- A cache lifetime is a constant and goes through a service. Why this shape: decision
  `native-next-caching`.

## Boundaries

- Secrets and server-only values never reach a client component.
- No client-side data fetching and no client-side server-state library.
- No global mutable state: state a page needs lives in the URL (search params) or in the form's own
  state.
- Do not rename existing exports or routes only for cosmetic reasons.
