# Testing Rules

The project keeps an automated suite: Jest with Testing Library in jsdom through `next/jest` (decision
`tests-jest-tdd`). `npm test` runs it once; `npm run test:watch` watches. End-to-end tests are rejected
(decision `no-e2e-tests`). Work is test-driven and tests are written to the maximum.

## TDD

- **Red, green, refactor.** A failing test first, then the smallest code that passes it, then the
  refactor with the test green. A test that was never seen failing proves nothing.
- The failing test is committed on its own as `test:`, before the code that fixes it, so the history shows
  the test failing for the right reason; the code follows in a `feat:` or `fix:` commit.
- A bug starts with a test that reproduces it; the fix is done when that test passes.
- A change of behavior updates the test that described it first, then the code.

## What to test

- Services: the endpoint functions over a mocked fetcher or `fetch`: URL, method, payload, cache option,
  the error result.
- The fetcher and its error handling: successful and failed responses, the error classes and messages.
- Server Actions: with `next/navigation`, `next/cache` and the services mocked, assert validation
  failures, the form state returned, `revalidatePath` calls and `redirect` (including its toast query).
- Utils: validation, query strings, form and action state, any non-trivial transform, with the invalid
  and empty cases.
- Components: what the user sees and can do; every state that renders differently (loading, empty, error,
  disabled, with and without optional props).
- Hooks: the logic moved out of a component, through `renderHook` or the component that uses it.
- Pages with logic (checking an id or a query, choosing between results): render the async page with its
  services mocked.

## What not to test by default

- Plain constants and configuration without behavior.
- Layout and styling classes, and Next.js or React internals.
- `robots.js` and `sitemap.js`, until they hold logic beyond a list.
- A library's own behavior (Sonner, `next/link`): test only how the project uses it.

## Structure

- A test sits next to the module it checks, named `<module>.test.js` or `<module>.test.jsx`; the module
  has a folder with an `index.js` (`ai/rules/style.md`).
- Shared mocks live in `tests/mocks`, shared test-only helpers in `tests/utils`, each in a folder of its
  own with an `index.js`.
- Imports use the `@/` alias wherever one reaches the module.
- A `describe` label names the unit in PascalCase words (`Quote Form`); an `it` label says the behavior
  (`shows the error under the text field`).

## Mocking

- Mock what is outside the unit: `next/navigation` hooks and `redirect`, `next/cache`, the services in an
  action or a page test, `fetch` in a service test. A test never calls the real API.
- A test never depends on `.env`: `next/jest` loads it locally, but CI has none. A module that reads an
  environment value at import (`SITE_URL`, `HOME_QUOTE_ID`) is mocked with the value the test needs.
- Keep a mock small and explicit; share one through `tests/mocks` only when it removes real repetition.
- Server Actions are called directly as functions with a `FormData`; a component test mocks the action.

## Testing Library

- Query as a user does: `getByRole` with `name`, then `getByLabelText`, then `getByText`; `getByTestId` is
  the last resort and needs a reason.
- Interact with `fireEvent` (no other event library is installed), and assert the visible result or the accessible state (`aria-invalid`,
  `aria-expanded`, `role="alert"`), not the implementation.
- Use `findBy*` or `waitFor` for what appears later; never a fixed timeout.

## Coverage

- Coverage only grows: a change does not lower it, and a new module arrives with its tests.
- A test is changed only when the behavior it describes changed on purpose; none is deleted or skipped to
  make a change pass.
