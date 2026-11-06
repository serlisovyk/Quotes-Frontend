# Spec: search text and author links with special characters (MY-234)

## Behavior

- A search text containing RegExp special characters (`c++`, `(ab`, `.*`, `a|b`, `[x`, `\`) renders the
  results page without an error. The text is matched literally and case-insensitively, as any other
  text, and every match is highlighted. A search text shorter than three characters is not highlighted.
- The author link of a quote card and of the quote page opens `/search?author=<author>` with the author
  encoded as a query value: `A & B`, `C#`, `x+y` reach the search page as exactly that author.
- Nothing else changes: the truncation, the `...` marker and the category links behave as before.

## Out of scope

Highlighting without RegExp, other links, the search form.
