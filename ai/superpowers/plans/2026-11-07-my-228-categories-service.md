# Plan: categories service (MY-228, frontend part)

Branch `my-228-categories-service`. No spec: nothing observable changes, no page calls the service yet
(category suggestions in search come later, MY-243). The backend part is merged: `GET /categories` answers
`{ total, categories }`, and `/quotes` keeps `{ total, quotes }`.

## Decisions in this plan

- **Cache: `cache: 'no-store'`.** The only planned consumer is search suggestions, driven by what the user
  types, so the arguments are user-driven exactly like a quote search (decision `native-next-caching`).
  Time-based revalidation can replace it when a page renders an unfiltered list; that is a one-line change.
- **The fetcher's query allow-list gains `name`.** `fetcher.get` runs every query through
  `createSearchQueryString`, which keeps only `ALLOWED_SEARCH_PARAM_NAMES`, so `name` would be dropped
  silently. `createSearchQueryString` takes the allow-list as a second argument (default unchanged:
  the search form and page keep exactly their params), and the fetcher passes
  `ALLOWED_API_QUERY_PARAM_NAMES`, the union of the quotes and categories lists. The search form's own
  params do not change.
- Same shape as the quotes service: `fetchCategories(queryParams)` and a page-safe
  `fetchCategoriesResult(queryParams)` returning `{ categories, total, hasError }`; a missing field falls
  back to `[]` and `0`, a failure to the empty result with `hasError: true`.

## Changes

- `constants/api.constant.js`: `CATEGORIES_API_ENDPOINT`, `ALLOWED_CATEGORIES_PARAM_NAMES`
  (`name`, `limit`, `offset`), `ALLOWED_API_QUERY_PARAM_NAMES`.
- `utils/query-string`: the optional allow-list argument; `services/fetcher`: passes the union.
- `services/categories/` (`categories.service.js`, `index.js`, test).
- Docs: `README.md` API section (both list responses), `ai/map.md` (the new service). No rule changes.

## Tests (red first, own `test:` commit)

- Service: URL and query string (`name`, `limit`, `offset`; an unknown param is dropped), the `no-store`
  option, the result shape, an empty `{ total: 0, categories: [] }`, missing fields, an error giving
  `hasError`.
- `createSearchQueryString` with a custom allow-list; fetcher keeps `name` in the URL.

## Verification

The four checks of `AGENTS.md`, plus `npm run test:coverage` (thresholds hold) and one read-only live
`GET /categories?limit=3&name=lif` to confirm the response shape.
