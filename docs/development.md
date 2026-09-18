# Development Notes

## Stack

- Next.js App Router
- React
- JavaScript ESM
- Tailwind CSS
- Server Actions for quote mutations
- Native Next.js `fetch` caching
- Jest + Testing Library
- Docker for local container runs

## Environment

Create `.env` for local development or `.env.production` for production-like runs.

Required variables:

- `API_URL`: backend API base URL.
- `SITE_URL`: public frontend URL used by metadata, robots, and sitemap.
- `PORT`: Next.js server port.
- `HOSTNAME`: use `0.0.0.0` in Docker.

Docker dev watcher variables:

- `CHOKIDAR_USEPOLLING`: enables polling for file watching in containers.
- `WATCHPACK_POLLING`: enables webpack polling for file watching in containers.

Tracked examples:

- `.env.sample`
- `.env.production.sample`

## Commands

```powershell
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Docker

Production compose uses the published frontend image:

```powershell
docker compose up -d
```

Development compose builds from `Dockerfile.dev` and mounts the project:

```powershell
docker compose -f docker-compose.dev.yml up --build
```

The production `Dockerfile` expects Next.js standalone output, so `next.config.mjs` must keep `output: 'standalone'`.
