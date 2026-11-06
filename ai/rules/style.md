# Style Rules

Prettier decides the formatting (`.prettierrc`); these are the rules it does not. They apply to new and
touched code: do not rewrite a file only to match them.

## General

- **No comments in code**: JavaScript, JSX, CSS and the root configs. Names and small functions say
  what the code does; a durable "why" goes to a rule, a skill or a decision record.
- Early `return` instead of nested `if` / `else`; no nested ternaries.
- **A clean `return`**: a name, a literal, one call or a boolean of names. A `reduce`, a `map`, a
  comparison or a ternary is computed into a `const` first:

  ```js
  const remaining = quotes.filter((quote) => !quote.isHidden)
  const hasHidden = remaining.length < quotes.length

  return { remaining, hasHidden }
  ```

- **Named conditions**: a long condition becomes named `const`s or early returns, one idea per line.
- Booleans start with `is`, `has`, `can` or `should` (`isPending`, `hasError`).
- No magic numbers or strings: shared values come from `_config/constants.js`.
- Repeated scaffolding (a `try` / `catch` around every call) goes into one private helper.
- **Blank lines group steps** (read, compute, write). A multi-line statement is its own paragraph. A
  guard is its own paragraph: the `if`, together with a `const` made only for it. When the checked value
  is used further on (`const quote = ...` + `if (!quote) return`), a blank line separates the `if` from
  it. A guard of one or two lines has no blank line inside.
- A destructuring statement is its own paragraph: props or the main object first, hooks after it.
- Destructure in `map` callbacks (`({ id, text }) =>`), not a repeated `quote.id`.
- Parameter names say what they are (`quoteId`, `isDisabled`), not a bare `x` or `data`.
- **Functions**: a component, a page and a Server Action are declared with `function`; every function
  inside a component (a handler, a helper) is a `const` arrow. Module-level helpers in `_utils` keep
  `function`; service endpoints are `const` arrows.
- An arrow whose body is one expression is written in the concise form when it fits the print width:
  `const closeMenu = () => setIsOpen(false)`.

## Files, names and imports

- Components are PascalCase files in `app/_components`; every other module is camelCase
  (`quoteActions.js`, `queryString.js`). Tests are `<Name>.test.js[x]` in a `__tests__` folder next to
  what they cover.
- Names in code: components and classes PascalCase, hooks `use<Name>`, functions camelCase verbs,
  constants `UPPER_SNAKE_CASE`. A ref is named after the element it points to (`titleInputRef`).
- Imports across folders use the aliases from `jsconfig.json` (`@components`, `@config`, `@actions`,
  `@services`, `@utils`, `@public`); `./` only for a sibling.
- **Import order**: framework and packages, then aliased modules, then `./` siblings, then styles.
- One component per file: a piece that renders markup of its own is its own component, except a tiny
  private helper only that file uses.

## JSX and text

- Interface texts are English and keep the capitalization of the existing headings and buttons
  (`Random Quotes`, `Create New`); one action has one name wherever it shows.
- A blank line separates sibling elements and components inside the JSX of a `return`, at every level.
  Consecutive self-closing components without children stay together; a text child stays next to its
  element.
- Text for assistive technology only uses Tailwind's `sr-only`, not `hidden` or `display: none`.

## Tailwind CSS

- Style with Tailwind utility classes in `className`. A stylesheet rule goes into `globals.css` only for
  what utilities cannot express (the base colors, a custom utility under `@layer utilities`).
- No inline `style` attribute, no CSS Modules, no CSS-in-JS.
- Colors come from the Tailwind palette or the two custom properties `--background` and `--foreground`;
  a color used for light also gets its `dark:` variant, so both color schemes keep their contrast.
- Mobile first: the base classes are the narrowest layout, `sm:`, `md:`, `lg:` add width. Check 390 px.
- A class string used by more than one component, or longer than a line or two, is a constant (in
  `_config/constants.js` or `_config/site.js`) or a variant map inside the component (`Button`).
- A state is a utility variant (`hover:`, `focus-visible:`, `disabled:`, `aria-disabled:`), never a
  script-toggled class when the markup already has the attribute.
- Never remove a focus indicator (`focus:outline-none`) without a visible replacement such as a ring.
- Transitions name the property (`transition-colors`), never `transition-all`; motion respects
  `motion-reduce:`.
