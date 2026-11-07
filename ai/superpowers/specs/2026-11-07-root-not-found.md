# Spec: our 404 page for unknown URLs (MY-339)

## Behavior

- Any unknown URL (`/nope`, `/a/b/c`): HTTP **404** and the project's not-found page inside the
  site layout: header, heading "Page not found", the explanation, the "Go to home page" link, footer.
  Today Next.js shows its stock "404: This page could not be found." without the header and footer.
- `notFound()` inside a route (`/quotes/abc`, `/quotes/999999999`) behaves as before: 404 and the same page.
- Every other page (`/`, `/random`, `/search`, the forms) and every URL is unchanged.
- `next dev` no longer appends the `nextjs-agent-rules` block to `AGENTS.md`.

## Out of scope

A different look of the 404 page, `global-not-found`, any experimental Next.js flag.
