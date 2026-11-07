# Spec: reliable API requests and error screens (MY-377)

## Behavior

- **Hanging backend.** A request that gets no answer within 8 seconds is aborted. The page shows its own
  error state instead of waiting for the platform to cut it: search, random and the category suggestions
  show their inline error, the home card is left out, a quote page and the edit page show the "Something
  went wrong" screen, a form or the delete button shows an inline message.
- **`API_URL` with a trailing slash** (`https://host/`) and without it (`https://host`) reach the same URL,
  `https://host/quotes`: no `//`, no 308 redirect.
- **Query parameters.** `/quotes` receives only `text`, `author`, `category`, `limit`, `offset`;
  `/categories` receives only `name`, `limit`, `offset`. A stray `name` on the search page never reaches
  `/quotes`, a stray `text` never reaches `/categories`.
- **Rate limit (HTTP 429).** The create and edit forms show "Too many requests, please try again in a few
  minutes." above the button, and so does the delete button under it. The backend's own message is not
  shown for a 429.
- **Failed page load.** `error.jsx` keeps the same screen and also writes the error (and its digest, when
  there is one) to the console once per error.
- **Error in the root layout.** A new `global-error.jsx` shows a full page of its own (`<html>`, `<body>`):
  the same heading, text and "Try again" button as `error.jsx`, in the site's colours, light or dark as
  the user chose (the head script runs there too; light when it cannot). It logs the error like
  `error.jsx`. "Try again" calls `reset`.

## Out of scope

An external error tracker (author's decision), retries, a different 429 handling (queueing), a friendlier
text for network failures other than 429, a header and footer on the global error page.
