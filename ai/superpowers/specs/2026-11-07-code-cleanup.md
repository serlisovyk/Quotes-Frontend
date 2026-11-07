# Spec: code cleanup (MY-239)

What a user or a caller sees after the change. Everything not listed here looks and works as before.

## Quote form validation

Limits follow the backend: text 10 to 2500 characters, author 2 to 255, 1 to 10 categories, a category name
at most 50 characters and only `[a-z0-9-]`. The messages carry the backend's meaning:

| Field      | Failure                         | Message                                                                                         |
| ---------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| text       | fewer than 10 or more than 2500 | `Text must be from 10 to 2500 characters.`                                                      |
| author     | fewer than 2 or more than 255   | `Author must be from 2 to 255 characters.`                                                      |
| categories | none, or more than 10           | `There must be from 1 to 10 categories.`                                                        |
| categories | a name longer than 50           | `Category name must be at most 50 characters.`                                                  |
| categories | a name outside `[a-z0-9-]`      | `Invalid categories: <names>. Category can only contain lowercase letters, numbers and dashes.` |

Boundaries are inclusive: 10 and 2500 characters pass, 9 and 2501 fail; 10 categories pass, 11 fail.

## Search form

The limit field's `max` is `MAX_SEARCH_LIMIT` (50, as before). The messages for category, limit and offset keep
their meaning; only the home of the strings changes. When the page passes new `initialSearchValues` (a new
search was submitted), the fields show them and the validation errors and the "show errors" flag are cleared;
focus stays on the Search button.

## Ids

`isQuoteValidId` accepts only a whole string of digits in `1..MAX_ENTITY_ID`: `12abc`, `1.5`, `-1`, ` 12`,
`0`, an empty string and `undefined` are rejected, so `/quotes/12abc` is a 404 instead of loading quote 12.

## Quote form

- The heading comes from a `title` prop (`Create New Quote`, `Edit Quote`), not from the button text.
- After a failed submit the form shows the returned values and errors; typing clears the errors and keeps
  the typed values; Reset restores the initial values. Same as before, without an effect copying state.

## Buttons

`Button` renders just the `<button>` or the link: no wrapper `div`, no margin of its own. Each parent
spaces its buttons (`gap`), so the home page, the quote page, both forms, the random page, the 404 page and
the error page look as they did.

## Loader

A CSS spinner replaces `react-spinners`: a ring that turns (it pulses instead under `prefers-reduced-motion`), hidden from assistive
technology. The "Loading" announcement stays in `LoadingStatus` (`role="status"`).

## Pagination

Looks and works as before (Prev, 1 ... 4 5 6 ... 20, Next; the current page marked `aria-current="page"`;
the ends disabled). The page list becomes a util and `PaginationLink` a component of its own.

## Toasts

Same texts and durations, now from constants.

## Category tags

A quote page's tags are centered with the same gap; the list no longer gets a stray `false` class.

## Errors from the API

Only the `{ error: { code, message, fields } }` shape is read; any other body gives `Some error occurred`
with the response status.
