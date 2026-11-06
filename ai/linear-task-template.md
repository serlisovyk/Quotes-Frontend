# Linear task template (Quotes frontend)

Every Linear issue for this repo follows the structure below. **The issue itself is written in Russian**:
the title, the section headings exactly as shown, the body, and the checklist lines. This file explains
each section in English. The `linear-tasks` skill uses it as the source of structure when creating
issues.

Drop empty or irrelevant sections: no placeholders. Sections marked _(optional)_ are added only when
there is something to say.

Issue metadata: project **Quotes**, team `MY`, label `Frontend` plus a type label (`Feature` /
`Improvement` / `Bug` / `UI` / `Infra` / `AI`), the milestone matching the area of work (Фундамент, Баги и
безопасность, Рефакторинг, Полировка), state `Todo`. Use a "blocked by" relation only for a real technical
dependency; otherwise "related".

The title stays short; specifics go into the body.

---

## Порядок _(optional)_

Which issues (`MY-<n>`) this one comes after and why, and which issues build on it.

## Зачем

The problem or gap today and what should change. One or two paragraphs, grounded in the code (page,
component, service, current behavior), focused on the result a user sees.

## Что сделать

A numbered list of concrete steps:

- which pages, components, services, actions and config are touched;
- states and edge cases: keyboard and touch, loading, empty and error states, a backend failure, an
  invalid id or query, 390 px width, light and dark color schemes;
- anything to be decided in the plan: phrase it as «решить в плане»; the assignee then stops after the
  plan commit and waits for the author's approval.

## Решения автора (<date>) _(optional)_

The author's answers given before the work starts: final for the assignee.

## Готово когда

Observable criteria that can be checked by hand: not "done", but "when X, the app does Y".

## Риски и крайние случаи _(optional)_

What can break and which other issues it affects.

## Вне скоупа _(optional)_

What is deliberately excluded; adjacent work goes into separate issues, linked.

## Обязательно проверить и обновить

Keep the relevant lines, delete the rest. Copy them into the issue as-is:

- [ ] `ai/superpowers/` — план (+ спека, если меняется поведение) одним коммитом до кода
- [ ] Тест до кода: падающий тест отдельным коммитом `test:`, баг — сначала тест, который его воспроизводит
- [ ] `README.md` — фичи, скрипты, структура
- [ ] `ai/map.md` — если добавлен, переименован или удалён файл, папка, роут, переменная окружения или скрипт
- [ ] `ai/rules/*`, `ai/skills/*` — если изменился паттерн
- [ ] `ai/decisions/` — датированная запись, если зафиксировано долгоживущее решение
- [ ] Доки в пределах лимитов `ai/rules/docs.md`; если лимит превышен — сократить

## Проверка

Copy into the issue, one line per check under "Verification" in `AGENTS.md`, plus the manual line and the
CI line:

- [ ] `npm run format:check`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Прогнано руками в `npm run dev` против живого API: десктоп и 390px, клавиатура и мышь
- [ ] CI зелёный после push
