# Agent contract

This file is the compressed contract of this codebase's invariants, written
for coding agents. Humans should start with
[docs/ONBOARDING.md](docs/ONBOARDING.md) and
[CONTRIBUTING.md](CONTRIBUTING.md); everything here is stated fully in the
doc each line links to.

## Repo shape

- The whole site is one Next.js 16 app (App Router, React 19, Tailwind 4,
  Supabase) in `client/`. There is no separate backend: server logic lives
  in route handlers under `client/src/app/api/`.
  ([client/README.md](client/README.md))
- Node is pinned to **24** (`client/.nvmrc`, `client/.tool-versions`).
  Older versions fail with misleading errors. ([docs/Setup.md](docs/Setup.md))

## Commands

Run from `client/`:

```bash
npm run dev          # local server at http://localhost:3000
npm run lint && npm run typecheck && npm test   # the three CI gates
npm run lint:fix     # apply auto-fixable lint findings
```

All three checks must pass before a push. CI additionally runs `next build`;
a missing env var or a prerender error fails there even when the three local
checks pass. ([CONTRIBUTING.md](CONTRIBUTING.md#before-you-push))

## Import boundaries (ESLint-enforced, fail CI)

([docs/ZONES.md](docs/ZONES.md#shared-conventions))

- `features/*` may import from `shared/*`, never from another feature.
- `shared/*` never imports from `features/*`.
- Nothing under `features/*` or `shared/*` imports from `app/`. Route
  shells re-export feature pages, never the reverse.
- Go through the shared barrels: `@/shared/ui`, `@/shared/lib`,
  `@/shared/lib/client`, `@/shared/lib/server`. No deep imports into shared
  internals. The three `shared/lib` entry points exist so browser bundles
  never pick up server-only code.
- Import from `@/` (maps to `client/src/`), not long relative chains.

## Access control

Any surface exposing applicant data (names, emails, phone numbers,
addresses, resumes, essay answers) must sit behind `requireAdmin()` in a
server component or `getAdminUser()` in a route handler. Middleware and
`USER_PATHS` only gate signed-out visitors; they cannot tell an admin from a
member. ([client/README.md](client/README.md#two-layers-of-protection))

## Environment variables

A new env var must land in three places: documented in
[`client/env.example`](client/env.example), added to GitHub Actions secrets,
and added to the Vercel project settings. `.env` is gitignored; never commit
it. ([client/README.md](client/README.md#deployment))

## Code conventions

([CONTRIBUTING.md](CONTRIBUTING.md#code-conventions))

- TypeScript throughout, `strict` on, avoid `any`.
- Tailwind for styling; reuse existing tokens and gradient utilities rather
  than adding one-off colors.
- New behaviour gets tests; [docs/client/Testing.md](docs/client/Testing.md)
  has a template and cookbooks (mocking Supabase, `next/navigation`, async
  server components).
- A new page or component gets a matching note under
  [docs/client/](docs/client/). If a change makes an existing doc wrong,
  fix the doc in the same PR.

## Taxonomy files

The zone and area lists are hand-maintained across several files
(`.github/labeler.yml`, `.github/CODEOWNERS`, `.github/workflows/`,
`docs/ZONES.md`, `docs/AREAS.md`, `.github/ISSUE_TEMPLATE/task.yml`, the
ESLint boundary config). If you touch any of them, run
`node scripts/check-taxonomy.mjs` before pushing; the Taxonomy consistency
workflow fails CI on drift. ([docs/ZONES.md](docs/ZONES.md#keeping-the-zone-list-in-sync))

## Git

([CONTRIBUTING.md](CONTRIBUTING.md#branches))

- Never commit to `main`. Every push to `main` deploys to production.
- Branch off the latest `main`, named `type/issue-number-short-description`.
- Conventional Commits: `type: short summary in the imperative mood`, types
  `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore`. Bodies
  say why, not what.
- Keep PRs inside one zone where possible, link the issue with
  `Closes #<n>`, and never force-push once review has started.
