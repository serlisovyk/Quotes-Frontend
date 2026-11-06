# Spec: 404, error and loading states, noindex for forms (MY-236)

## Behavior

- `/quotes/<id>` and `/quotes/<id>/edit`:
  - an invalid id (`abc`, `0`, `2147483648`) or a quote the API reports as 404: HTTP **404** and the
    custom not-found page;
  - a network error or any other API failure (5xx): the error page with a "Try again" button.
- Any unknown URL (`/nope`): HTTP 404 and the same custom not-found page.
- Not-found page: heading "Page not found", a short explanation and a "Go to home page" link.
- Error page: heading "Something went wrong", a short explanation and a "Try again" `<button>` that
  renders the segment again (`reset`). The header and footer stay visible on both pages.
- `/random` and `/search` show a spinner while they load, announced to assistive technology as
  "Loading". The quote pages have no loading state: it would turn their 404 into a 200.
- Home page: unchanged, it renders without the quote card on any failure.
- `/quotes/create` and `/quotes/<id>/edit` carry `<meta name="robots" content="noindex">`; `sitemap.xml`
  lists home, random and search only.

## Out of scope

A retry or a custom message per failure kind, logging of the error.
