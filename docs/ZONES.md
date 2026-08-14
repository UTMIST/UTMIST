# Zones

This repo is organized into ownership **zones**. Zones are divided by duty, not
headcount — there are no leads, every owner is a dev, and one person may own
multiple zones. This doc is the source of truth for each zone's mission,
paths, and owner.

## Foundational zones

Foundational zones are cross-cutting — changes here affect every feature.

### Design system

**Mission:** Owns the component library, design tokens, and Tailwind/theme
configuration. Maintains the navbar/footer layout shell and reusable
primitives (cards, sliders, carousel) that every feature builds on.

**Paths:**
- `client/src/shared/ui/`
- `client/src/app/layout.tsx`
- `client/src/app/globals.css`
- `client/src/app/not-found.tsx`
- `client/src/app/dev/`
- `client/src/styles/navbar.css`
- `client/src/styles/footer.css`
- `client/src/styles/dropdown.css`
- `client/src/styles/gradients.css`

**Owner:** TBD

### Platform

**Mission:** Owns the Supabase clients, auth and middleware, the user
model/roles, and storage/Google Drive integration. This is the layer that
connects the front end to live club data.

**Paths:**
- `client/src/shared/lib/`
- `client/src/middleware.ts`

**Owner:** TBD

### DevEx / CI-CD

**Mission:** Owns workflows, CODEOWNERS, labelers, lint/typecheck/test
config, boundary rules, deployment, and contributor docs. Keeps the repo
buildable and the contributor path clear.

**Paths:**
- `.github/`
- `docs/`
- `client/eslint.config.mjs`
- `client/tsconfig.json`
- `client/jest.config.js`
- `client/jest.setup.js`
- `client/next.config.ts`
- `client/package.json`

**Owner:** TBD

## Feature zones

Each feature zone is a `features/<zone>/` module plus its routes. No
monolithic admin zone exists — each feature owns its own admin/management
screens.

### Public site

**Mission:** Owns the homepage, departments, projects, sponsors page, blog,
startups, and program pages. Deliberately broad — mostly low-coupling
static/marketing surfaces — and the first target for auto-updating content.

**Paths:**
- `client/src/features/public-site/`
- `client/src/assets/`
- `client/src/app/page.tsx`
- `client/src/app/departments/`
- `client/src/app/projects/`
- `client/src/app/sponsors/`
- `client/src/app/blog/`
- `client/src/app/startups/`
- `client/src/app/ai2/`
- `client/src/app/eigenai/`
- `client/src/app/ml-fundamentals/`
- `client/src/app/api/umami/`
- `client/src/styles/` (all stylesheets not claimed file-level by another
  zone below)

**Owner:** TBD

### Recruitment

**Mission:** Owns the applicant portal — application intake, review, and
interview scheduling — including its own admin screens.

**Paths:**
- `client/src/features/recruitment/`
- `client/src/app/apply/`
- `client/src/app/applicants/`
- `client/src/app/admin/`
- `client/src/app/api/applications/`
- `client/src/app/api/apply/`
- `client/src/app/api/drive_upload/`

**Owner:** TBD

### Careers

**Mission:** Owns the company job postings surface for sponsors and
partners.

**Paths:**
- `client/src/features/careers/`
- `client/src/assets/careers.json`
- `client/src/app/careers/`
- `client/src/styles/careers.css`

**Owner:** TBD

### Events

**Mission:** Owns event pages, registration, and post-event content,
including event management screens.

**Paths:**
- `client/src/features/events/`
- `client/src/app/events/`
- `client/src/styles/events.css`

**Owner:** TBD

### Members

**Mission:** Owns auth flows, profile, dashboard, and leaderboard. Future
home of the compute-platform UI.

**Paths:**
- `client/src/features/members/`
- `client/src/app/auth/`
- `client/src/app/profile/`
- `client/src/app/dashboard/`
- `client/src/app/api/auth/`

**Owner:** TBD

## Shared conventions

### Import rules

- `features/*` may import from `shared/*`, never from another feature.
- `shared/*` never imports from `features/*`.
- Nothing under `features/*` or `shared/*` imports from `app/` — route
  shells re-export feature pages, never the reverse.
- Features must go through the shared barrels — `@/shared/ui`,
  `@/shared/lib`, `@/shared/lib/client`, `@/shared/lib/server` — not deep
  imports into shared internals. `shared/lib` has three entry points
  (universal, client-only, server-only) instead of one, so browser bundles
  never pick up server-only code (e.g. `next/headers`, googleapis).
- These rules are enforced by ESLint on *resolved* import paths, so
  relative imports (`../recruitment/...`) and `@/` aliases are policed
  identically, and a new `features/<zone>/` directory is picked up
  automatically. Violations fail CI.
- `client/src/styles/` is a flat, cross-zone stylesheet directory rather than
  a `shared/*` module, so it's split file-level across zones instead of
  living under one owner — see the Design system, Careers, Events, and
  Public site path lists above. New stylesheets should be colocated with
  their owning zone going forward instead of added to this shared folder.

### How work flows

An issue is filed with the **Zone** dropdown set on the task template. A
workflow reads that dropdown and applies the matching `zone:<name>` label
automatically, which lands the issue in its owner's lane on the project
board. When a PR touching a zone's paths is opened, the same path-based
labeling applies the zone label to the PR, and CODEOWNERS automatically
requests review from that zone's owner.

## Keeping the zone list in sync

The zone list is hand-maintained in several files (`.github/labeler.yml`,
`.github/CODEOWNERS`, this doc, the issue template's Zone dropdown, the
issue-labeling workflow, and the ESLint boundary config). CI runs
`node scripts/check-zones.mjs` (the **Zone consistency** workflow) to
cross-check them, with the `zone: <name>` labels in `.github/labeler.yml`
as the canonical list. If you add, rename, or remove a zone, update every
file and run the script locally before pushing.
