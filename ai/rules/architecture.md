# Architecture Rules

Sources live in `app/` (Next.js App Router). `ai/map.md` says where every folder lives;
`ai/rules/react.md` covers components and hooks.

## Layers

Data flows one way: `_config` and `_utils` → `_services` → pages and Server Actions → components. Each
folder has one job:

| Layer          | Owns                                                                 | Must not                                 |
| -------------- | -------------------------------------------------------------------- | ---------------------------------------- |
| `_config/`     | shared values: routes, limits, cache seconds, field definitions      | import from another layer                |
| `_utils/`      | pure helpers: validation, query strings, form and action state       | call the API or read `process.env`       |
| `_services/`   | every backend call, behind `server-only`                             | know about React or the UI               |
| `_actions/`    | Server Actions: mutations, validation result, revalidation, redirect | render UI                                |
| `_components/` | markup and local interactive state                                   | import `_services`, read `API_URL`       |
| `(routes)/`    | pages and layouts: fetch on the server, pass data down               | hold logic a util or a service could own |

## Data fetching

- Fetch on the server, in a page, a layout or a server component. A component is a client component
  (`'use client'`) only when it needs state, effects, browser APIs or hooks such as `useRouter`; keep it
  as small as possible and pass it data as props.
- Every API call goes through `_services`: `fetcher.js` builds the URL from `API_URL`, `services.js`
  exposes one function per endpoint. A page or an action never calls `fetch` itself.
- `API_URL` is server-only: never prefix it with `NEXT_PUBLIC_`, never read it outside `_services`.
- A read that a page renders returns a result the page can show (`{ quotes, hasError }`), so a backend
  failure becomes an inline message, never a crashed page. A read that returns `null` for a missing item
  (`fetchQuoteByIdOrNull`) lets the page render its not-found message.
- Validate what comes from the URL (`isQuoteValidId`, the allowed search params) before it reaches the
  API.

## Server Actions

- `'use server'` files hold mutations only: validate the form data, call a service, revalidate, redirect.
- Validation runs on the server through `_utils/validation.js`, and the action returns the form state
  (`values`, `errors`, `formError`) instead of throwing; an API failure is turned into the same state.
- After a successful mutation the action calls `revalidatePath` for every public page that shows the
  quote, then `redirect`s. `redirect` works by throwing, so it is called outside any `try` / `catch`
  that turns errors into form state.
- Success is told with a `?toast=<type>` query parameter that `AppToasts` turns into a Sonner toast and
  then removes from the URL; a failure is an inline message next to the form or the button.

## Caching

- Time-based revalidation for a stable page: home (`HOME_QUOTE_REVALIDATE_SECONDS`) and quote details
  (`QUOTE_DETAILS_REVALIDATE_SECONDS`). `cache: 'no-store'` for search, random and the edit page's read.
- Every mutation calls `revalidatePath` for the pages it can change.
- A new cache option or lifetime is a constant in `_config/constants.js` and goes through a service. Why
  this shape: decision `native-next-caching`.

## Boundaries

- Secrets and server-only values never reach a client component.
- No client-side data fetching and no client-side server-state library (decision `native-next-caching`).
- No global mutable state: state a page needs lives in the URL (search params) or in the form's own
  state.
- Do not rename existing exports or routes only for cosmetic reasons.
