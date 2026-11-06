# Plan: search text and author links with special characters (MY-234)

Branch `my-234-search-escaping`. Linear issue MY-234, milestone Баги и безопасность. Behavior:
`ai/superpowers/specs/2026-11-06-search-escaping.md`.

## Author's decisions (2026-11-06)

- Highlight: escape RegExp special characters with a small util; the rest of the highlight logic stays.
- Author links: built through the existing `createSearchQueryString`, with `ROUTES.SEARCH`.
- TDD: failing tests for the bugs first, committed alone as `test: reproduce ...`, then the fix.
- The util is a new file that follows its neighbours in `app/_utils` until the repo-wide rename.

## Changes

- `app/_utils/escapeRegExp.js`: `escapeRegExp(value)` backslash-escapes `. * + ? ^ $ { } ( ) | [ ] \`.
- `app/_utils/utils.js`: `highlightText` builds its RegExp from `escapeRegExp(searchText)`.
- `app/_components/Quote.jsx` and `app/(routes)/quotes/[id]/page.jsx`: the author link is
  `${ROUTES.SEARCH}?${createSearchQueryString({ author })}`.
- `ai/map.md`: `escapeRegExp.js` added to the `_utils/` list.

## Tests (written first, red)

- `app/_utils/__tests__/escapeRegExp.test.js`: every special character, a plain string, the empty string.
- `app/_utils/__tests__/utils.test.jsx`: `highlightText` with `c++`, `(ab`, `.*`, `a|b`, mixed case, a short
  text; `renderQuoteText` branches: short search text, truncated text with the match outside the visible
  part, a match inside the visible part.
- `Quote.test.jsx`: author link href for `A & B`, `C#`, `x+y`; a quote card with `c++` renders.
- Quote page test: the page is an async server component; it is awaited with mocked services and the
  result rendered, asserting the author link href.

## Verification

`npm run format:check`, `npm run lint`, `npm test`, `npm run build` (`.env` copied only for the build and
dev). In the browser on port 4102: `/search?text=c%2B%2B`, `/search?text=(ab`, a `.*` search, the author
link href, at desktop width and 390 px.
