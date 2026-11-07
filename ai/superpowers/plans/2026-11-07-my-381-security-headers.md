# Plan: security headers and Dependabot (MY-381)

Branch `my-381-security-headers`. No page, form or interaction changes, so no spec.

## Author's decisions (2026-11-07)

- All points of the issue are agreed.

## Decisions in this plan

- **Headers for every path** through `headers()` in `next.config.mjs`, source `/:path*`: `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
  `Content-Security-Policy: frame-ancestors 'none'`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- **Values are constants** in `src/constants/security.constant.js` (`SECURITY_HEADERS`, a list of `{ key, value }`),
  next to the other domain constants and exported by the barrel.
- **`next.config.mjs` imports the file by its relative path** (`./src/constants/security.constant.js`): Next loads
  the root config with native ESM, where the `@/` alias and a folder `index.js` barrel do not resolve. The file
  has no imports of its own, so it loads as it is.
- **No unit test.** The module is plain data and `headers()` is a one-line wrapper (`ai/rules/testing.md`: no tests
  for constants and configuration without behavior). The real check is `curl -I` on the built server.
- **No full CSP** (decision record `security-headers-without-csp`): the theme head script and Next's inline
  scripts need a nonce, a nonce makes every page dynamic. Only `frame-ancestors 'none'` is sent.
- **Dependabot** (`.github/dependabot.yml`): ecosystems `npm` and `github-actions`, weekly, minor and patch
  updates grouped per ecosystem, major `eslint` and `@eslint/js` ignored while `eslint-stays-on-9` stands.

## Changes

- `src/constants/security.constant.js`, `src/constants/index.js`, `next.config.mjs`, `.github/dependabot.yml`.
- Docs: `ai/map.md` (config line, constants, Dependabot), decision record and index line.
  `README.md` lists none of this.

## Verification

- `npm run format:check`, `lint`, `test:coverage`, `build`.
- `npm run start` on a free port, `curl -I` on `/`, `/search`, `/quotes/1`, a 404 and `/api/categories?name=lif`.
