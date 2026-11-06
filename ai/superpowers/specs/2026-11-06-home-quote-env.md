# Spec: the home page does not depend on one hardcoded quote (MY-237)

## Behavior

- The home page shows a quote card next to the Churchill text when the server-only variable
  `HOME_QUOTE_ID` holds a valid quote id and the API returns that quote.
- With no variable, an invalid id, a quote the API does not have, or an API error, the home page renders
  without the quote card: the hero, the text and the Random / Search buttons stay. There is no
  full-page error message.
- An unset or invalid id never reaches the API.
- The id is not shown to the browser; the card still revalidates hourly.

## Out of scope

A random quote as the card, a new error message, changes to the hero text or the buttons.
