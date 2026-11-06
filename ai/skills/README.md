# Skills

Repo-local skill playbooks. Plain Markdown: any AI agent reads them directly. Each file has `name` +
`description` frontmatter so it maps to a matching skill entry when a tool supports one. A skill is a
recipe; what must hold is in `ai/rules/`. The other docs are listed in `AGENTS.md`.

- [feature](feature.md): how a feature flows through config, service, Server Action, page, component and
  test; recipes for a new page, a form field, a search parameter and a mutation.
- [review](review.md): self-review of a diff: regressions, scope creep, accessibility, tests and docs
  drift.
