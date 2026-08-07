# Quotes App

This is a Fullstack project for displaying and managing quotes. It allows users to view random quotes, search for quotes by various criteria, and manage (create, edit, delete) quotes through an interactive interface.

## Demo

https://quotes-xi-five.vercel.app/

## Tools

<p align="left">
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/postgresql-colored.svg" width="40" height="40" alt="Postgresql" />

  <img width="12" />

  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nodejs-colored.svg" width="40" height="40" alt="NodeJS" />

  <img width="12" />

  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/express-colored.svg" width="40" height="40" alt="Express" />

  <img width="12" />

  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/docker-colored.svg" width="40" height="40" alt="Docker" />

  <br>
  <br>

  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nextjs-colored.svg" width="40" height="40" alt="Next js" />

  <img width="12" />

  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg" width="40" height="40" alt="React" />

  <img width="12" />

  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg" width="40" height="40" alt="Tailwind" />

  <img width="12" />

  <img src="https://www.svgrepo.com/show/353930/jest.svg" width="40" height="40" alt="Jest" />

  <img width="12" />
</p>

## Getting Started

## Filling database with initial data

Follow instructions in the `database/seed/README.md` file to fill database with quotes and categories.
All necessary database files are located in the `database/data`.

## Running with Docker

Main Docker mode uses published Docker Hub images:

- `serhii5105/quotes-server:latest`
- `serhii5105/quotes-client:latest`

1. `cd Quotes`
1. `Copy-Item server/.env.sample server/.env`
1. `Copy-Item client/.env.sample client/.env`
1. Replace description strings in `server/.env` and `client/.env` with real values
1. For Docker mode set in `server/.env`:
   `DB_HOST=postgres`
1. Optional for Adminer convenience:
   `ADMINER_DEFAULT_SERVER=postgres`
1. `npm run docker:refresh`

Services:

- Client: `http://localhost:4000`
- API: `http://localhost:3001`
- Adminer: `http://localhost:8080`

Notes:

- Postgres is available only inside the Docker network by default.
- In this mode the frontend runs from the published image.
- `PORT` and `HOSTNAME` from `client/.env` are used at runtime.
- `NEXT_PUBLIC_API_URL` from `client/.env` does not rebuild or reconfigure the published image on its own.
- If you change frontend env that affects the build, rebuild and push a new `quotes-client` image first.

To stop containers:

1. `npm run docker:down`

To stop containers and remove the database volume:

1. `npm run docker:down:volumes`

## Running with Docker in development mode

Development Docker mode uses local Dockerfiles and bind mounts.

1. `cd Quotes`
1. `Copy-Item server/.env.sample server/.env`
1. `Copy-Item client/.env.sample client/.env`
1. Replace description strings in `server/.env` and `client/.env` with real values
1. For Docker mode set in `server/.env`:
   `DB_HOST=postgres`
1. In `client/.env` set:
   `HOSTNAME=0.0.0.0`
1. `npm run docker:dev`

This mode runs:

- server via `nodemon`
- client via `next dev`
- local dev images from `server/Dockerfile.dev` and `client/Dockerfile.dev`

To stop it:

1. `npm run docker:dev:down`

## Updating Docker Hub images

Rebuild and push new images after:

- backend or frontend code changes
- dependency updates
- Dockerfile changes
- base image updates

Commands:

```powershell
docker build -t serhii5105/quotes-server:latest ./server
docker push serhii5105/quotes-server:latest

docker build -t serhii5105/quotes-client:latest ./client
docker push serhii5105/quotes-client:latest
```

Then refresh local containers:

```powershell
npm run docker:refresh
```

## Running locally without Docker

### API

1. `cd server`
1. `Copy-Item .env.sample .env`
1. Set local database values such as `DB_HOST=localhost`
1. `npm install`
1. `npm run dev`

### Client

1. `cd client`
1. `Copy-Item .env.sample .env`
1. `npm install`
1. `npm run dev`

## Frontend Folders Structure

```text
app
├── _components        # Shared components like buttons and forms
├── _config            # Configuration files, including API endpoints
├── _queries            # Tanstack queries for fetching data
├── _services         # Services for interacting with the API
├── _utils             # Utility functions for fetching data and helper functions
└── (routes)           # Dynamic routes for handling different pages
    ├── quotes         # Routes related to managing quotes
    │   ├── [id]       # Routes related to single quote
    │   │   └── edit   # Route for editing single quote
    │   └── create     # Route for creating a single quote
    ├── search         # Route related to searching for quotes
    ├── fonts          # Custom font files
    ├── globals.css    # Global CSS styles
    ├── layout.js      # Main layout component
    └── page.js        # Page for displaying random quotes
    └── query-provider.js # Query provider for Tanstack queries
```

## API Endpoints

The app interacts with the following backend API endpoints:

- GET **`/random`**: Fetches random quotes.
- GET **`/quotes`**: Fetches and searches for quotes (e.g., by text, author, category).
- POST **`/quotes`**: Creates a new quote.
- GET **`/quotes/:id`**: Fetches a specific quote by its ID.
- PATCH **`/quotes/:id`**: Edits an existing quote.
- DELETE **`/quotes/:id`**: Deletes a quote.
