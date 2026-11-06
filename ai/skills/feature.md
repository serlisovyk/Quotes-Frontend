---
name: feature
description: Use when adding or changing a user-facing feature in the Quotes frontend: which layer owns its values, API call, mutation, page, component and test, and how they connect.
---

# Feature

## When to use

Adding or changing anything a user sees or anything that reads or changes quotes: a page, a form field, a
search parameter, a mutation, a message.

## Steps

1. Read `ai/map.md` and the rules (`architecture`, `react`, `style`); do not rediscover the code. Names
   below are the standard's; a new file in the current tree follows its neighbours (`ai/rules/style.md`).
2. Split the feature across the layers before writing code:
   - **Constants**: every new shared value (a route, a limit, a cache lifetime, a field definition) in the
     `*.constants.js` of its domain; a new public route also goes into the menu and the sitemap.
   - **Utils**: the logic as pure functions in a `*.utils.js` (validation, query strings, form and action
     state). No React, no `fetch`, no `process.env`.
   - **Service**: a new endpoint call is one function in the quotes service over the fetcher, with its
     cache option (`no-store`, or `next.revalidate` from a constant). A read a page shows returns a result
     with `hasError`; a read for one item returns `null` when it fails.
   - **Server Action**: a `*.action.js` with `'use server'`: validate with the validation utils, call the
     service, then `revalidatePath` for every page that shows the data and `redirect` with
     `?toast=<type>`. Return form state for a validation or API failure; keep `redirect` outside
     `try` / `catch`.
   - **Page**: a server component in a route folder: await `params` / `searchParams`, check the id or
     query, fetch through a service, render the inline error and empty states, export `metadata` with a
     canonical URL.
   - **Component**: a folder `components/<name>/` with `<name>.jsx` and `index.js`, server by default;
     `'use client'` only for the interactive part, with its logic in `use-<name>.js`. A form uses
     `useActionState` and shows `errors`, `formError` and a pending state.
   - **Toast**: a new success type is a message in the toasts component's map; failures stay inline.
   - **Styles**: Tailwind utilities with the role-named colour tokens, light and dark.
3. Write the test next to the module (see Tests), then run the checks.
4. Verify per `ai/rules/definition-of-done.md`: use the feature at desktop width and at 390 px against the
   live API, with keyboard and mouse, including its error and empty states.

## Tests

- Services: mock `fetch` or the fetcher; assert the URL, method, payload, cache option and the error
  result.
- Utils: plain input and output, including the invalid and empty cases.
- Components: render with Testing Library, query by role or accessible name, mock `next/navigation` hooks
  and Server Actions; assert what the user sees and does.
- A changed behavior updates the test that described it; never delete a test to get green.

## Recipes

**A form field**: add it to the initial form values and the form field definitions, read it from the form
data, validate it, include it in the request payload, and map it back for the edit form.

**A search parameter**: add its name to the allowed search params and the initial search values, its field
to the search field definitions, its validation to the search validation; the search page passes it to the
service and the pagination keeps it in its links.

**A mutation**: a service function, a Server Action, a form or button with `useActionState`, a toast type
and the `revalidatePath` calls; the tests cover success and failure.

**A page**: a route folder with `page.jsx` and `metadata`; add the route to the routes constant, the menu
and the sitemap when it is public; decide its cache (time-based, or `dynamic = 'force-dynamic'`).
