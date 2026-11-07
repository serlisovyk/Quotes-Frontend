# Quotes Client

Next.js frontend for browsing, searching, creating, editing, and deleting quotes.

## Demo

https://quotes-xi-five.vercel.app/

## Backend

https://quotes-backend-eight.vercel.app/

## Stack

<p align="left">
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nextjs-colored.svg" width="40" height="40" alt="Next.js" />
  <img width="12" />
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg" width="40" height="40" alt="React" />
  <img width="12" />
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg" width="40" height="40" alt="Tailwind CSS" />
  <img width="12" />
  <img src="https://vitest.dev/logo.svg" width="40" height="40" alt="Vitest" />
  <img width="12" />
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/docker-colored.svg" width="40" height="40" alt="Docker" />
</p>

## Features

- Random quotes page with manual refresh.
- Search by text, author, category (with suggestions from the API) and page size, with pagination.
- Quote details page.
- Create, edit, and delete quote flows.
- Server Actions for mutations.
- Native Next.js server-side data fetching and cache invalidation.
- Inline error states and success toasts.
- Metadata, favicon, sitemap, and robots configuration.
- Light, dark and system theme, set before the first paint.
- Unit and component tests with Vitest and Testing Library.

## Getting Started

1. Install dependencies:

```powershell
npm install
```

2. Create local env file:

```powershell
Copy-Item .env.sample .env
```

3. Replace description values in `.env` with real values:

```dotenv
NODE_ENV=development
PORT=4000
HOSTNAME=localhost
SITE_URL=http://localhost:4000
API_URL=https://quotes-backend-eight.vercel.app/
```

4. Start the app:

```powershell
npm run dev
```

App URL:

```text
http://localhost:4000
```

## Scripts

- `npm run dev`: start local development server.
- `npm run build`: build production app.
- `npm run start`: start production server.
- `npm run lint`: run ESLint.
- `npm run lint:fix`: run ESLint with `--fix`.
- `npm run format`: format files with Prettier.
- `npm run format:check`: check Prettier formatting.
- `npm run prepare`: install the Husky pre-commit hook (runs on `npm install`).
- `npm test`: run tests.
- `npm run test:watch`: run tests in watch mode.
- `npm run test:coverage`: run tests with the coverage report (`coverage/`) and thresholds.

## CI

GitHub Actions runs lint, format check, tests with coverage thresholds, and build on every push. The build uses the real backend, so it needs the repository secrets `API_URL` and `SITE_URL`. The pre-commit hook (Husky and lint-staged) runs ESLint and Prettier on staged files.

## Docker

Production compose uses the published frontend image:

```powershell
docker compose up -d
docker compose down
```

Development compose builds the local dev image and mounts the project:

```powershell
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.dev.yml down
```

The frontend service reads variables from `.env`.

## Environment

- `NODE_ENV`: environment mode.
- `PORT`: port for the Next.js web server.
- `HOSTNAME`: host for the Next.js server. Use `0.0.0.0` in Docker.
- `SITE_URL`: public site base URL used for metadata, robots, and sitemap.
- `API_URL`: server-side backend API base URL.
- `HOME_QUOTE_ID`: server-side id of the quote on the home page. Optional: without it, or with an invalid id or a missing quote, the home page has no quote card.

Production example is available in `.env.production.sample`.

## Project Structure

```text
ai                  # Agent docs: map, rules, workflow, decisions
public              # Static files: home page photo, logo, favicon
src
├── actions         # Server Actions for quote mutations
├── app             # App Router routes: pages, layouts, robots, sitemap
├── components      # UI components, one folder each
├── config          # Site, home quote and form field config
├── constants       # Routes, menu, limits, cache lifetimes
├── errors          # API error class
├── services        # Server-only API layer
├── tests           # Shared test mocks and helpers
└── utils           # Form, validation, query, and action-state helpers
```

## API

The frontend expects the backend to provide:

- `GET /quotes/random`
- `GET /quotes`
- `POST /quotes`
- `GET /quotes/:id`
- `PATCH /quotes/:id`
- `DELETE /quotes/:id`
- `GET /categories` (`limit`, `offset`, `name`)

Both lists answer with a `total` and their items: `GET /quotes` as `{ total, quotes }`, `GET /categories` as
`{ total, categories }` (`categories: [{ id, name }]`; no match gives `{ total: 0, categories: [] }`).

## Notes

- API requests are server-only and use `API_URL`.
- Search and random pages are intentionally uncached.
- Home and quote details use native Next.js time-based revalidation.
- Mutations revalidate affected routes before redirecting.
