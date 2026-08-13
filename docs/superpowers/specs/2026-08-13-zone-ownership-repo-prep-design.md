# Zone Ownership & Repo Prep — Design

**Date:** 2026-08-13
**Status:** Approved pending review

## Goal

Restructure the UTMIST website repo into ownership **zones** so that devs own areas
end-to-end, and prep the repo (CODEOWNERS, labels, issue intake, boundary
enforcement) ahead of onboarding. Zones are divided by **duty**, not headcount:
there are no leads, all owners are devs, and one person may own multiple zones.

## Zone map

### Foundational zones (cross-cutting; changes affect everyone)

| Zone | Scope | Paths (post-migration) |
|---|---|---|
| **Design system** | Component library, design tokens, Tailwind/theme config, navbar/footer layout shell, reusable cards/sliders/carousel | `client/src/shared/ui/` |
| **Platform** | Supabase clients, auth + middleware, user model/roles, storage/Google Drive integration; the "connect front-end to live club data" layer | `client/src/shared/lib/`, `client/src/middleware.ts` |
| **DevEx / CI-CD** | Workflows, CODEOWNERS, labelers, lint/typecheck/test config, boundary rules, deployment, contributor docs | `.github/`, `client/*.config.*`, `docs/Setup.md` |

### Feature zones (each is a `features/<zone>/` module plus its routes)

| Zone | Scope | Routes |
|---|---|---|
| **Public site** | Homepage, departments, projects, sponsors page, blog, startups, program pages; first target for auto-updating content | `/`, `departments`, `projects`, `sponsors`, `blog`, `startups`, `ai2`, `eigenai`, `ml-fundamentals` |
| **Recruitment** | Applicant portal: application intake, review, interview scheduling (including its admin screens) | `apply`, `applicants`, recruitment parts of `admin` |
| **Careers** | Company job postings surface for sponsors/partners | `careers` |
| **Events** | Event pages, registration, post-event content (including event management screens) | `events` |
| **Members** | Auth flows, profile, dashboard, leaderboard; future home of the compute-platform UI | `auth`, `profile`, `dashboard` |

### Zone rules

- **No monolithic admin zone.** Each feature owns its own admin/management screens.
- **Public site is deliberately broad** — mostly low-coupling static/marketing
  surfaces. Split later (e.g., blog) if ownership demands it.
- **Import rules:** `features/*` may import `shared/*`, never another feature.
  `shared/*` never imports `features/*`. Enforced by lint (below), so foundational
  owners review anything promoted to shared.

## Target directory structure

```
client/src/
  app/            # thin route shells only — pages import from features
  features/
    public-site/
    recruitment/
    careers/
    events/
    members/
      # each contains only what it needs: components/ hooks/ api/ types.ts
  shared/
    ui/           # Design system zone
    lib/          # Platform zone: auth, supabase, storage, user
  middleware.ts
```

Path aliases: `@/features/*`, `@/shared/*` (added to `tsconfig.json`).
`app/api` route handlers stay in `app/` (Next.js requirement) but their logic
moves into the owning feature's `api/` directory.

## Ownership plumbing

1. **`docs/ZONES.md`** — source of truth: each zone's mission (from the vision
   doc), paths, and owner(s). Owners start as `TBD` placeholders.
2. **`.github/CODEOWNERS`** — one block per zone mapping to its directories.
   GitHub auto-requests the owner's review on PRs touching the zone. Entries
   point at the repo admin until owners are assigned.
3. **Zone labels + auto-labeler** — one `zone:<name>` label per zone, applied to
   PRs by path via `actions/labeler` (same pattern as the existing PR-size
   labeler).
4. **Issue templates** — a task/feature template with a required "Which zone?"
   dropdown (applies the zone label), plus a bug template. Zone labels let the
   project board slice work into per-owner lanes.
5. **Boundary lint** — ESLint import-restriction rules enforcing the zone import
   rules above; violations fail CI.
6. **Required CI check** — after this lands, mark the `build` check as required
   in branch protection on `main` (currently zero required checks). CODEOWNERS
   review starts **advisory** (not required for merge) to fit volunteer cadence;
   revisit once owners are established.

Out of scope: per-zone CI pipelines, monorepo tooling (Turborepo/workspaces) —
a single Next.js app doesn't need them, and they would tax onboarding for no
benefit.

## Migration plan (full restructure)

Current size: 113 TS/TSX files, ~13.5k LOC, 43 components, 20 route groups,
6 API routes, 27 test files. Estimated 1.5–2 focused days.

Order of operations — typecheck, lint, and tests must be green after each step:

1. **Consolidate auth/supabase into `shared/lib`** — merge the duplicated
   `lib/auth`, `lib/supabase`, `utils/auth.ts`, `utils/supabase`, `utils/user.ts`
   into one deliberate API. The risky step: touches middleware and every authed
   page; verified (tests + manual smoke of authed routes) before anything else
   moves.
2. **Stand up `shared/ui`** — move `components/ui` plus reusable primitives
   (cards, slider, carousel), navbar/footer, theme provider/toggles.
3. **Move features one zone at a time** — for each zone: create
   `features/<zone>/`, move its components/hooks/logic, thin out its `app/`
   pages to shells, fold its `app/api` logic into `features/<zone>/api/`.
4. **Turn on boundary lint last** — locks in the finished state.
5. **Update the periphery** — jest config and tests, `docs/FileStructure.md`,
   CODEOWNERS paths, `docs/ZONES.md`.

Risks:

- **Auth consolidation** is the only step with real regression risk; only 27
  tests exist and no e2e, so verification is partly manual smoke-testing of
  auth, profile, dashboard, and admin routes.
- **In-flight branches** will conflict with the moves. Do the migration while
  the repo is quiet (now, pre-onboarding).

## Success criteria

- Every file in `client/src` belongs to exactly one zone; CODEOWNERS covers all
  zone paths.
- `npm run typecheck`, `lint`, `test`, and `build` pass; main authed and public
  routes smoke-tested.
- Boundary lint fails CI on cross-feature imports.
- A new dev can read `docs/ZONES.md` and know what they own, where it lives,
  and how work reaches them (issue → zone label → board lane → PR → auto review
  request).
