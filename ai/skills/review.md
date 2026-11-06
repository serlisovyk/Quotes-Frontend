---
name: review
description: Use to self-review a diff in the Quotes frontend for regressions, scope creep, accessibility, test gaps and docs drift before reporting a change done.
---

# Review

## When to use

Self-review pass before handing over any non-trivial change, per `ai/workflow.md`.

## Checklist

Walk the diff against `ai/rules/definition-of-done.md` and the rules of the areas it touches
(`architecture`, `react`, `style`, `scope`). Then check what the rules do not cover:

- **Pages**: home, random, search, details, create and edit still render; an invalid id, a missing quote
  and a backend failure each show their inline message instead of a crash; metadata and canonical URLs
  are right.
- **Search**: text, author, category, limit and offset combine; unknown or invalid params are ignored or
  reported; an empty search shows nothing, a search without results says so; pagination keeps the filters.
- **Mutations**: create, update and delete validate on the server, show field and form errors inline,
  keep the typed values after a failure, revalidate every affected page, redirect and show the success
  toast once; the delete button shows its pending state and its error.
- **Caching**: home and details are time-based, search, random and the edit read are `no-store`; a
  mutation does not leave a stale list or detail page behind.
- **Server and client**: no `API_URL` or service import in a client component; a client component is as
  small as it can be; props passed to it are serializable.
- **Accessibility in the browser**: every flow by keyboard alone; visible focus; names, states and
  errors are announced once; contrast in light and dark color schemes, hover and disabled included;
  390 px and 200% zoom without horizontal scroll; the burger menu and skip link work.
- **React**: no state that could be derived; no manual memoization; effects only synchronize with
  something outside React; list keys are ids.
- **Tests**: new behavior has a test that fails without the change; no test was skipped or deleted to get
  green; tests query by role or accessible name.
- **Style**: the whole diff read line by line against `ai/rules/style.md` and `react.md`: blank lines, destructuring,
  import order, one component per file, what a component file holds, colour tokens, no comments.
- **Scope**: nothing from `ai/rules/scope.md` slipped in; no unrelated rewrites; removed behavior left no
  unused code, classes or constants.
- **Docs drift**: the docs still match the code, none went over its limit (`ai/rules/docs.md`), and a
  decision record exists if a durable decision was made.

## Verification gaps to catch

- Build and tests green, but the change was never used in the browser against the live API.
- Checked on desktop only, never at 390 px or by keyboard.
- Checked in one color scheme only.
- Checked in the happy path only: not with a backend error, an empty result, an invalid id.
- Checked a form on success only, not the failed submit and the typed values.

## Report

State what was checked and what was found: fix it or say plainly why a finding is being left alone, per
`ai/workflow.md`'s report step.
