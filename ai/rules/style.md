# Style Rules

Prettier decides the formatting (`.prettierrc`); these are the rules it does not. They follow the
workspace code style standard plus this project's naming (decision `naming-like-backend`).

## General

- **No comments in code**: JavaScript, JSX, CSS and the root configs. Names and small functions say what
  the code does; a durable "why" goes to a rule, a skill or a decision record.
- Early `return` instead of nested `if` / `else`; no nested ternaries.
- **A clean `return`:** a name, a literal, one call or a boolean of names. A `reduce`, a `map`, a
  comparison or a ternary is computed into a `const` first:

  ```js
  const visible = quotes.filter((quote) => !quote.isHidden)
  const hasHidden = visible.length < quotes.length

  return { visible, hasHidden }
  ```

- **Named conditions:** a long condition becomes named `const`s or early returns, one idea per line.
- Booleans start with `is`, `has`, `can` or `should` (`isPending`, `hasError`).
- No magic numbers or strings: shared values come from `constants/`.
- Repeated scaffolding (a `try` / `catch` around every call) goes into one private helper.
- **Blank lines group steps** (read, compute, write). A multi-line statement is its own paragraph. A guard
  is its own paragraph: the `if`, together with a `const` made only for it (`const hasErrors = ...` +
  `if (hasErrors) return`). When the checked value is used further on (`const quote = ...` +
  `if (!quote) return`), a blank line separates the `if` from it. A block of one or two lines (a guard
  with a `return`) has no blank line inside.
- A destructuring statement is its own paragraph: the props or the main object comes first, the hooks
  after it.
- Destructure in `map` callbacks (`({ id, text }) =>`), not a repeated `quote.id`.
- Parameter names say what they are (`quoteId`, `isDisabled`), not a bare `x` or `data`.
- **Functions:** a component, a hook, a page and a Server Action are declared with `function`; every
  function inside a component or a hook (a handler, a helper) is a `const` arrow function. Module-level
  functions, such as those in `utils/`, keep `function`.
- An arrow whose body is one expression is written in the concise form when it fits the print width:
  `const closeMenu = () => setIsOpen(false)`.

## Files, names and imports

- Files and folders are kebab-case. A module carries its role as a singular suffix: `.service.js`,
  `.fetcher.js`, `.action.js`, `.util.js`, `.constant.js`, `.config.js`, `.error.js`, `.mock.js`,
  `.test.js` (`quotes.constant.js`, `escape-reg-exp.util.js`). A component and a hook have no suffix:
  `components/quote-form/quote-form.jsx`, `hooks/use-quote-form/use-quote-form.js`. Names Next.js
  requires stay as they are (`page.jsx`, `layout.jsx`, `not-found.jsx`, `robots.js`, `sitemap.js`).
- Every module, a util included, lives in a folder of its own with an `index.js` barrel
  (`utils/escape-reg-exp/escape-reg-exp.util.js`). A test sits next to the module it covers
  (`quote-form.test.jsx`); shared mocks and test helpers live in `tests/mocks` and `tests/utils`
  (`ai/rules/testing.md`).
- Names in code: components and classes PascalCase, hooks `use<Name>`, functions camelCase verbs,
  constants `UPPER_SNAKE_CASE`. A ref is named after the element it points to (`titleInputRef`).
- Named exports only. Pages, layouts and the other route files keep the default export Next.js requires.
- One alias, `@/`, is the root of the sources. Imports across folders go through it and the folder's
  barrel; inside one folder a sibling is imported directly (`./quote-form.jsx`). ESLint rejects `../`, a
  folder's own barrel, a default export outside the route files and a name that is not kebab-case.
- **Import order:** packages, then `@/` modules with `@/constants` last, then `./` siblings, then styles.
- **One component per file**, no exception: a piece that renders markup is a component of its own, in its
  own folder, even when one component is its only user.
- A file of a component holds only its imports and the component: constants go to `constants/`, helpers
  to `utils/`, logic to a hook.
- A constant lives in the file of its domain (`QUOTE_TEXT_MAX_LENGTH` in `quotes.constant.js`). General
  helpers (`isPlainObject`) live in a util module of their own, not in a domain one.

## JSX and text

- Interface texts are English and keep the capitalization of the existing headings and buttons; one
  action has one name wherever it shows.
- A blank line separates sibling elements and components inside the JSX of a `return`, at every level.
  Consecutive self-closing components without children stay together; a text child stays next to its
  element.
- Text for assistive technology only uses Tailwind's `sr-only`, not `hidden` or `display: none`.

## Tailwind CSS

- Style with utility classes in `className`; a stylesheet rule goes into `globals.css` only for what
  utilities cannot express. No inline `style`, CSS Modules or CSS-in-JS.
- **Colours only through tokens:** role-named theme variables in `globals.css` (`@theme`: `--color-page`,
  `--color-surface`, `--color-text-muted`, `--color-danger`), each with a light and a dark value. Components
  use the role utilities (`bg-surface`, `text-danger`), never a raw palette colour (`bg-violet-900`) or a
  hex value. A new colour gets both values and a contrast check in both schemes.
- Spacing, radii, font sizes and durations come from Tailwind's scales or the theme; no arbitrary value
  (`w-[137px]`) when a scale step fits.
- Mobile first: base classes are the narrowest layout, `sm:`, `md:`, `lg:` add width. Check 390 px.
- A class string longer than a line or two, or shared by components, is a variant map inside the
  component or a constant in `constants/`.
- A state is a utility variant (`hover:`, `focus-visible:`, `disabled:`, `aria-disabled:`).
- Never remove a focus indicator without a visible replacement such as a ring.
- A transition names its property (`transition-colors`), never `transition-all`; motion respects
  `motion-reduce:`.
