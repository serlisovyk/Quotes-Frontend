# Plan: sources in `src/`, file names and structure like the backend

Issue MY-238, branch `my-238-src-structure`. No spec: observable behavior does not change. The target
scheme is decision `naming-like-backend`; this plan only says how the tree gets there.

## Author's answers (final)

- Sources move to `src/`: `src/app/` holds only Next.js route files; the layers are `components`,
  `services`, `actions`, `utils`, `constants`, `config`, `tests` (and `hooks` when one exists), no
  underscores. `public/` stays at the root.
- One alias, `@/` → `src/`, in `jsconfig.json` and Jest; the six old aliases go.
- Names as in the decision. ESLint guards the scheme.
- `utils/utils.js` is split by meaning; `menuItems` becomes `MENU_ITEMS`; constants go to domain files.

## Decisions made in this plan

- **Barrels.** `constants/` and `config/` are flat folders with domain files and one `index.js` using
  `export *` (as the backend does); the rest is one folder per module with its own `index.js` listing
  the names (`export *` above four). Imports across layers target the folder (`@/utils/query-string`),
  never a layer-wide barrel, so a client component cannot pull `server-only` code in through a barrel.
  `@/constants` and `@/config` are the only layer-wide barrels.
- **JSX helpers.** `renderQuoteText` and `highlightText` become `.util.jsx` modules, not components:
  their callers and tests keep the same call shape and output; turning them into components is a
  separate change.
- **Fetcher.** `fetcher` is a named export (`export const fetcher`), `api.fetcher.js`. The error class
  goes to `src/errors/api/api.error.js` (the backend has the same `errors/` layer); `createApiError` and
  `getApiErrorMessages` become util modules.
- **Images.** `public/` assets are referenced by URL (`src="/nav-icon.png"`, `"/churchill.jpg"`) with
  explicit `width` and `height` (200 × 200, 500 × 500 as already passed); `navIcon.png` becomes
  `nav-icon.png`, and the metadata, Open Graph and favicon paths follow. No `@public` alias.
- **Mock for `server-only`:** `src/tests/mocks/server-only/server-only.mock.js` with a barrel.
- **Renamed inside code only where a named export demands it:** `SearchForm.jsx` exported `SearchFields`;
  it is now `SearchForm`. Nothing else changes in a function body.
- **Left for MY-239:** constants, helpers and sub-components that still sit inside a component file
  (`Pagination`'s `PaginationLink`, class maps, toast messages) and other style-rule cleanups: this task
  moves and renames, it does not edit logic.

## ESLint (written first, scoped to `src/`)

`eslint-plugin-check-file` (dev dependency):

- `filename-naming-convention` KEBAB_CASE for `src/**/*.{js,jsx}`, middle extensions ignored.
- `folder-naming-convention` KEBAB_CASE for folders of `src/`; `(routes)` and `[id]` are allowed.
- `no-restricted-syntax`: `ExportDefaultDeclaration` outside the route files (`page`, `layout`,
  `not-found`, `error`, `loading` under `src/app`, `src/app/robots.js`, `src/app/sitemap.js`). One rule
  entry per file block: the `API_URL` selectors are merged into it, `services/` keeps only the
  default-export selector.
- `no-restricted-imports`: `../` patterns and a folder's own barrel (`.`, `./index`, `./index.js`); in
  `constants/` and `config/` also `@/constants` and `@/config`.
- The `API_URL` and `fetch` limits point at `src/services/**`; `app/_services/**` stays exempt only until
  the services move.

Evidence: each rule is shown firing on a probe through `eslint --stdin --stdin-filename` and passing on
the new tree; the probes are not committed.

## Order of commits (each builds and passes lint and tests)

1. `docs`: this plan.
2. `build`: `@/` alias beside the old ones (jsconfig, Jest), the ESLint rules, `eslint-plugin-check-file`.
3. `refactor` constants and config → `src/constants`, `src/config` (`MENU_ITEMS`, `nav-icon.png`).
4. `refactor` errors and utils → `src/errors`, `src/utils` (utils.js split, tests move with them).
5. `refactor` services → `src/services`, `src/tests/mocks/server-only`.
6. `refactor` actions → `src/actions`.
7. `refactor` components → `src/components` (named exports, folder and barrel each).
8. `refactor` routes and metadata files → `src/app`; `public/` assets renamed and referenced by URL.
9. `build`: old aliases, `app/_services` exemption and `mocks/` removed; Jest, Docker and lint-staged
   checked.
10. `docs`: `ai/map.md`, rules, skill, `AGENTS.md`, `CLAUDE.md`, README, decision status and index.

## Old → new paths

| Old                                                | New                                                                         |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| `app/_config/constants.js`                         | `src/constants/{api,menu,quotes,routes,search}.constant.js` + `index.js`    |
| `app/_config/site.js`, `home.js`, `inputFields.js` | `src/config/{site,home,input-fields}.config.js` + `index.js`                |
| `app/_utils/escapeRegExp.js` (+ test)              | `src/utils/escape-reg-exp/escape-reg-exp.util.js`                           |
| `app/_utils/queryString.js` (+ test)               | `src/utils/query-string/query-string.util.js`                               |
| `app/_utils/quoteActionState.js` (+ test)          | `src/utils/quote-action-state/quote-action-state.util.js`                   |
| `app/_utils/quoteForm.js` (+ test)                 | `src/utils/quote-form/quote-form.util.js`                                   |
| `app/_utils/validation.js` (+ test)                | `src/utils/validation/validation.util.js`                                   |
| `app/_utils/utils.js` `getSingleQuoteApiEndpoint`  | `src/utils/get-single-quote-api-endpoint/…util.js`                          |
| `app/_utils/utils.js` `getDisplayedCategories`     | `src/utils/get-displayed-categories/…util.js`                               |
| `app/_utils/utils.js` `renderQuoteText` (+ test)   | `src/utils/render-quote-text/render-quote-text.util.jsx`                    |
| `app/_utils/utils.js` `highlightText` (+ test)     | `src/utils/highlight-text/highlight-text.util.jsx`                          |
| `app/_services/fetcherErrorsHandler.js` `ApiError` | `src/errors/api/api.error.js`                                               |
| same, `getApiErrorMessages`, `createApiError`      | `src/utils/get-api-error-messages/…util.js`, `src/utils/create-api-error/…` |
| `app/_services/fetcher.js` (+ test)                | `src/services/fetcher/api.fetcher.js`                                       |
| `app/_services/services.js` (+ test)               | `src/services/quotes/quotes.service.js`                                     |
| `app/_actions/quoteActions.js` (+ test)            | `src/actions/quote/quote.action.js`                                         |
| `app/_components/<Name>.jsx` (+ test)              | `src/components/<name>/<name>.jsx` (+ `index.js`, `<name>.test.jsx`)        |
| `app/(routes)/**` (+ `__tests__`)                  | `src/app/(routes)/**`, tests beside the route file (`page.test.jsx`)        |
| `app/robots.js`, `sitemap.js` (+ test)             | `src/app/robots.js`, `sitemap.js`, `sitemap.test.js`                        |
| `mocks/empty.js`                                   | `src/tests/mocks/server-only/server-only.mock.js` + `index.js`              |
| `public/navIcon.png`                               | `public/nav-icon.png`                                                       |

Component folders: `app-toasts`, `burger-button`, `button`, `category-tag`, `category-tags`,
`delete-quote-button`, `footer`, `header`, `input-field`, `loader`, `loading-status`, `menu-items`,
`pagination`, `quote`, `quote-form`, `quote-form-fields`, `quotes`, `random-quotes-refresh-button`,
`search-form`, `status-message`.

## Test changes

Only import paths and file locations; mock factories of a component or a service change shape from a
default export to a named one (`() => ({ Quote: ... })`). Test files of the old `__tests__` folders that
cover several new modules are split by module. The number of tests stays 164 or grows.

## Verification

`format:check`, `lint`, `test` (164 tests before), `jest` with `.env` absent, `build`; dev server on
port 4108 against the live API: home, random, search, a quote, create → edit → delete, a 404, favicon and
logo, at desktop and 390 px. Grep of the old names (`_components`, `@components`, `@public`, `navIcon`,
`__tests__`, …) outside `ai/superpowers/` returns nothing. Docs: map, style, architecture, react,
testing, `feature` skill, `AGENTS.md`, `CLAUDE.md`, README, decision index.

## Changes during implementation

- The lint-staged run of the components commit failed on the Windows command-line limit (65 staged files
  with long paths); `.husky/pre-commit` now passes `--max-arg-length 6000`, in a `build:` commit of its own.
- The six old aliases and the transitional exemption went in one `build:` commit after the routes move,
  not in the routes commit.
- Decision `barrels-per-module` records the barrel and `.util.jsx` choices made above.
