# No file-watcher polling variables

Date: 2026-11-07 · Status: accepted

## Context

`CHOKIDAR_USEPOLLING` and `WATCHPACK_POLLING` were listed for Docker dev mode. Next 16 runs `next dev` on
Turbopack, which reads neither: they are not in the Next SWC binary, `CHOKIDAR_USEPOLLING` belongs to the
old chokidar watcher and `WATCHPACK_POLLING` only reaches webpack's watchpack. The Next 16 development
guide names `watchOptions.pollIntervalMs` in `next.config` as the one polling switch, and only as a last
resort: polling adds latency and CPU and I/O load.

## Decision

- The two variables are not in `.env.sample`, the README or the map, and nothing sets them.
- If Docker dev (`docker-compose.dev.yml`) turns out too slow to pick up edits, set
  `watchOptions.pollIntervalMs` in `next.config.mjs`; Docker's synchronized file shares are the other
  documented remedy.
- Rejected: keeping the variables "just in case" (they do nothing and suggest polling is on).
- Rejected: enabling `watchOptions.pollIntervalMs` now (no measured need, and it costs CPU on every run).

## Consequences

- Do not restore the two variables. Reaching for polling again is a new decision with a measurement behind
  it, recorded as a new file that supersedes this one.
