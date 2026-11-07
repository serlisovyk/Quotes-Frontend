# Spec: accessibility pass (MY-240)

## Behavior

- **Fields.** Every field of the create/edit form and the search form has a visible `<label>` above it, tied
  to the input (`htmlFor` / `id`). Labels: create form "Quote text", "Author", "Categories (comma-separated)";
  search form "Text", "Author", "Category", "Limit", "Offset". The placeholder is only an example
  ("e.g. courage") or absent. The clear button is named "Clear <label>".
- **Errors.** A field with a shown error keeps `aria-invalid` and `aria-describedby` to its message. The form
  error of the quote form and the delete error are announced (`role="alert"`).
- **Mobile menu** (below `md`). The burger opens a native `<dialog>` with `showModal()`: focus moves into the
  menu, the page behind is inert, Escape, the close button, a click on the backdrop and a click on a menu link
  close it, and focus returns to the burger. The burger keeps `aria-expanded` and `aria-controls`. Widening
  the window to `md` closes an open menu.
- **Focus.** Every interactive control shows the focus ring (`focus` token) on keyboard focus, in both
  themes: links in the quote card and on the quote page, burger, buttons (ring on `focus-visible`, not on
  mouse click), theme switch, inputs, pagination, tags, clear button.
- **Headings.** One `h1` per page. The header logo is not a heading. The home page gets an `h1`: the hero
  quote, same look. No skipped levels.
- **Author link.** The dash is hidden from assistive technology; the link is named "Quotes by <author>" on the
  quote card and the quote page; the look is unchanged.
- 320 px: no horizontal scroll.

## Out of scope

New colours (contrast was settled on tokens; only what this change adds is re-checked), floating labels, a
focus trap library, a new dependency (axe runs from outside the repo).
