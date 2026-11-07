# Env files never enter an image

Date: 2026-11-07 · Status: accepted

## Context

`.dockerignore` did not exclude `.env*`, so `COPY . .` copied them into the build and Next copied them into
`.next/standalone`, which the runner stage ships. Only URLs were in them, but a secret added later would
have been published to Docker Hub with the image. The home page is prerendered at build and fetches its
quote then: a build without `API_URL` gives a home page with no quote card, which the baked-in `.env` used
to hide.

## Decision

- `.dockerignore` excludes `.env*` (keeping `*.sample`); no image, production or dev, contains an env file.
- Values read at build time are build arguments in the builder stage: `SITE_URL`, `HOME_QUOTE_ID`,
  `API_URL`. The builder stage is not shipped, so they are not in the final image.
- Values read at run time (`API_URL`, `PORT`, `HOSTNAME`) come from `env_file` in compose or `--env-file`.
- CI builds the production image on every push with the build arguments from GitHub Secrets and never
  publishes it; publishing to Docker Hub stays manual (the author's decision).
- Rejected: baking `.env` into the image (secrets in a public image). Rejected: leaving `API_URL` out of
  the build (the home page loses its quote).

## Consequences

- A new variable read at build time needs an `ARG` in the `Dockerfile` and a `--build-arg` in CI; one read
  at run time needs neither.
- A secret never goes into an `ARG` of the final stage, and never into `COPY` of an env file.
