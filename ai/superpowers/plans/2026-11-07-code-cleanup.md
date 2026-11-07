# Plan: code cleanup (MY-239)

Branch `my-239-code-cleanup`; behavior in `ai/superpowers/specs/2026-11-07-code-cleanup.md`. Runs next to
MY-339 (moves `not-found.jsx`, `error.jsx` and the layout, edits `next.config.mjs`): this branch edits only the
content of those two files and never moves anything in `src/app`.

## Author's decisions (2026-11-07)

- Validation by the backend's current rules (read from its `validation.constant.js` and `errors.constant.js`).
- Dead code goes with its tests; `isQuoteValidId('12abc')` is rejected; the two `set-state-in-effect`
  violations are fixed and the ESLint exception is deleted; `PaginationLink` gets its own component; toast
  texts go to constants.
- Polling variables: only what Next 16 dev really needs stays; `.env.sample` without spaces around `=`.

## Decisions made in this plan

- **Backend error shape** (`AppError.toResponse`): `{ error: { code, message, fields } }`, so the legacy
  branch of `createApiError` goes. The `Some error occurred` text becomes `DEFAULT_ERROR_MESSAGE`.
- **Validation constants** live in `constants/validation.constant.js` (limits, `VALIDATION_MESSAGE`);
  `CATEGORY_NAME_REGEX` and `MAX_ENTITY_ID` stay in `quotes.constant.js`.
- **No effect for state.** `QuoteForm` keeps the user's edit together with the action state it was made on and
  shows the edit only while that state is current; `SearchForm` does the same with `initialSearchValues`.
  A `key` on the page would remount the form and drop the focus of the Search button, so no `key`.
- **Polling:** Next 16 runs `next dev` on Turbopack. Neither `CHOKIDAR_USEPOLLING` nor `WATCHPACK_POLLING`
  is read there (neither string is in the Next SWC binary; `WATCHPACK_POLLING` only reaches the webpack
  watcher), and the Next 16 development guide names `watchOptions.pollIntervalMs` in `next.config` as the
  only polling switch, as a last resort. Both variables are removed from `.env.sample`, README and the map.
  Adding `watchOptions` means editing `next.config.mjs`, which MY-339 owns: left to a later task if Docker dev
  needs it.
- **Spinner colours** use Tailwind palette classes for now; the theme tokens are another task's.
- **Button spacing:** parents use `gap-5 md:gap-10`, the sum of the old wrapper margins.
- **Pagination:** page list and href become a util (`utils/pagination`); class variants and numbers become
  `constants/pagination.constant.js`.

## Steps (red first)

1. Red `test:` commits, each alone: validation limits and messages, `isQuoteValidId`, `Button` without a
   wrapper, `QuoteForm` `title`, pagination util, loader.
2. Characterization `test:` commit (green, written before the refactor it guards): `QuoteForm` and
   `SearchForm` state, `Pagination`, `PaginationLink`, `createApiError`.
3. Code that turns each red green; dead code and its tests removed in one commit.
4. Refactors with tests unchanged: toasts, category tag, random refresh button, `max: 50`, 4+ props to `props`,
   magic numbers, blank lines.
5. `react-spinners` removed; ESLint exception removed; env files; docs (`ai/map.md`, README,
   `ai/rules/scope.md`).

## Verification

`format:check`, `lint`, `npm test` (164 before), `npm run build`; browser at 4112 against the live API: create
form, edit form, search form, random loading, pagination, buttons on home, 404 and error pages, 1280 and 390
px; quotes created for the check are deleted.
