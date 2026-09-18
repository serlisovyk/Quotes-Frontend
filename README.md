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
  <img src="https://www.svgrepo.com/show/353930/jest.svg" width="40" height="40" alt="Jest" />
  <img width="12" />
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/docker-colored.svg" width="40" height="40" alt="Docker" />
</p>

## Features

- Random quotes page with manual refresh.
- Search by text, author, category, limit, and offset.
- Quote details page.
- Create, edit, and delete quote flows.
- Server Actions for mutations.
- Native Next.js server-side data fetching and cache invalidation.
- Inline error states and success toasts.
- Metadata, favicon, sitemap, and robots configuration.
- Unit and component tests with Jest and Testing Library.

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
CHOKIDAR_USEPOLLING=false
WATCHPACK_POLLING=false
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
- `npm run format`: format files with Prettier.
- `npm run format:check`: check Prettier formatting.
- `npm test`: run tests.
- `npm run test:watch`: run tests in watch mode.
- `npm run docker:up`: start production compose service.
- `npm run docker:down`: stop production compose service.
- `npm run docker:dev`: start development compose service.
- `npm run docker:dev:down`: stop development compose service.

## Docker

Production compose uses the published frontend image:

```powershell
docker compose up -d
```

Development compose builds the local dev image and mounts the project:

```powershell
docker compose -f docker-compose.dev.yml up --build
```

The frontend service reads variables from `.env`.

## Environment

- `NODE_ENV`: environment mode.
- `PORT`: port for the Next.js web server.
- `HOSTNAME`: host for the Next.js server. Use `0.0.0.0` in Docker.
- `SITE_URL`: public site base URL used for metadata, robots, and sitemap.
- `API_URL`: server-side backend API base URL.
- `CHOKIDAR_USEPOLLING`: polling file watcher for Docker dev mode.
- `WATCHPACK_POLLING`: webpack polling watcher for Docker dev mode.

Production example is available in `.env.production.sample`.

## Project Structure

```text
app
├── _actions        # Server Actions for quote mutations
├── _components     # Shared UI components
├── _config         # Routes, constants, metadata config
├── _services       # Server-only API layer
├── _utils          # Form, validation, query, and action-state helpers
├── (routes)        # App Router pages and layouts
├── robots.js       # Robots metadata route
└── sitemap.js      # Sitemap metadata route
```

## API

The frontend expects the backend to provide:

- `GET /quotes/random`
- `GET /quotes`
- `POST /quotes`
- `GET /quotes/:id`
- `PATCH /quotes/:id`
- `DELETE /quotes/:id`

## Notes

- API requests are server-only and use `API_URL`.
- Search and random pages are intentionally uncached.
- Home and quote details use native Next.js time-based revalidation.
- Mutations revalidate affected routes before redirecting.
