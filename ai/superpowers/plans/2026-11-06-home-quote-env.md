# Plan: home quote id from the environment (MY-237)

Branch `my-237-home-quote-env`. Linear issue MY-237, milestone Баги и безопасность. Behavior:
`ai/superpowers/specs/2026-11-06-home-quote-env.md`.

## Author's decisions (2026-11-06)

- The id comes from the server-only variable `HOME_QUOTE_ID`; no random quote. `MY_QUOTE_ID` is removed
  from the constants.
- No variable, an invalid id, a missing quote or an API error: the home page renders without the card.
- TDD: failing page tests first, committed alone as `test:`.

## Decisions in this plan

- The variable is read in `app/_config/home.js` (`HOME_QUOTE_ID = process.env.HOME_QUOTE_ID`), the way
  `site.js` reads `SITE_URL`. Utils must not read `process.env` and `API_URL` stays in the services
  (`ai/rules/architecture.md`), so the page imports a config value and has no `process.env`.
- The page validates it with the existing `isQuoteValidId` and calls `fetchQuoteByIdOrNull` only for a
  valid id; the card section renders only when a quote came back. No new util, no new service.
- No new decision record: it follows `api-url-server-only` and `native-next-caching`.

## Changes

- `app/_config/home.js`: new, `HOME_QUOTE_ID`.
- `app/_config/constants.js`: `MY_QUOTE_ID` removed.
- `app/(routes)/page.jsx`: id from the config, guarded fetch, the card rendered only with a quote; the
  `StatusMessage` error branch is gone.
- `jest.config.js`: the `@public` alias (the page imports the Churchill photo).
- `.env.sample`, `.env.production.sample`, `README.md` (Environment), `ai/map.md` (home page line,
  environment list, `_config` list).

## Tests (written first, red)

`app/(routes)/__tests__/page.test.jsx`, the async page rendered with `@services/services` mocked and the
variable set per case: a valid id fetches that id and shows the card; unset, invalid (`abc`, `0`,
`2147483648`), `null` quote (what `fetchQuoteByIdOrNull` returns for a missing quote and for an API error) and a quote
without an id each render the hero and both buttons, no card, no
error text; the service is not called for an unset or invalid id.

## Verification

The four checks from `AGENTS.md`. In the browser on port 4106 against the live API: a valid
`HOME_QUOTE_ID`, an invalid one and an unset one, at desktop width and 390 px.
