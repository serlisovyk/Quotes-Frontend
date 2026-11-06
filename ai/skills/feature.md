---
name: feature
description: Use when adding or changing a user-facing feature in the Quotes frontend: which layer owns its values, API call, mutation, page, component and test, and how they connect.
---

# Feature

## When to use

Adding or changing anything a user sees or anything that reads or changes quotes: a page, a form field, a
search parameter, a mutation, a message.

## Steps

1. Read `ai/map.md` and the rules (`architecture`, `react`, `style`); do not rediscover the code.
2. Split the feature across the layers before writing code:
   - **Config**: every new shared value (a route, a limit, a cache lifetime, a field definition) in
     `_config/constants.js` or `_config/inputFields.js`; a new route also goes into the menu or the
     sitemap when it should be listed.
   - **Utils**: the logic as pure functions in `_utils` (validation, query strings, form and action
     state). No React, no `fetch`, no `process.env`.
   - **Service**: a new endpoint call is one function in `_services/services.js` over `fetcher`, with
     its cache option (`no-store`, or `next.revalidate` from a constant). A read a page shows returns a
     result with `hasError`; a read for one item returns `null` when it fails.
   - **Server Action**: in `_actions/`, validate with `_utils/validation.js`, call the service, then
     `revalidatePath` for every page that shows the data and `redirect` with `?toast=<type>`. Return form
     state for a validation or API failure; keep `redirect` outside `try` / `catch`.
   - **Page**: a server component in `app/(routes)`: await `params` / `searchParams`, check the id or
     query, fetch through a service, render the inline error and empty states, export `metadata` with a
     canonical URL.
   - **Component**: a PascalCase file in `_components`, server by default; `'use client'` only for the
     interactive part. A form uses `useActionState` and shows `errors`, `formError` and a pending state.
   - **Toast**: a new success type is a message in `AppToasts`' map; failures stay inline.
3. Write the test next to the code (see Tests), then run the checks.
4. Verify per `ai/rules/definition-of-done.md`: use the feature at desktop width and at 390 px against
   the live API, with keyboard and mouse, including its error and empty states.

## Tests

- Services (`_services/__tests__`): mock `fetch` or the fetcher; assert the URL, method, payload, cache
  option and the error result.
- Utils (`_utils/__tests__`): plain input and output, including the invalid and empty cases.
- Components (`_components/__tests__`): render with Testing Library, query by role or accessible name,
  mock `next/navigation` hooks and Server Actions; assert what the user sees and does.
- A changed behavior updates the test that described it; never delete a test to get green.

## Recipes

**A form field**: add it to `INITIAL_FORM_VALUES` and `createQuoteInputFields`, read it in
`createQuoteFormValuesFromFormData`, validate it in `getQuoteFormValidationErrors`, include it in
`createQuotePayload`, and map it back in `createQuoteFormValues` for the edit form.

**A search parameter**: add its name to `ALLOWED_SEARCH_PARAM_NAMES` and `INITIAL_SEARCH_VALUES`, its
field to `createSearchInputFields`, its validation to `getSearchInputValidationMessage`; the search page
passes it to `fetchQuotesResult` and `Pagination` keeps it in its links.

**A mutation**: a service function, a Server Action, a form or button with `useActionState`, a toast type
and the `revalidatePath` calls; the action's tests cover success and failure.

**A page**: a folder in `app/(routes)` with `page.jsx` and `metadata`; add the route to `ROUTES`, the
menu and `sitemap.js` when it is public; decide its cache (time-based, or `dynamic = 'force-dynamic'`).
