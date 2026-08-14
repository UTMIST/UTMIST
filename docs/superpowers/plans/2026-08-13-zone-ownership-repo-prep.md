# Zone Ownership Restructure & Repo Prep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `client/src` into `features/<zone>` + `shared/{ui,lib}` per the approved spec, then wire up zone ownership (ZONES.md, CODEOWNERS, labels, boundary lint, required CI check).

**Architecture:** Move code zone-by-zone with the test suite green after every task. Platform code consolidates into `src/shared/lib` with three entry points (`@/shared/lib` universal, `@/shared/lib/client` browser, `@/shared/lib/server` server-only — one barrel would mix `next/headers` into client bundles and break the build). Design system consolidates into `src/shared/ui` with one barrel. Feature code moves into `src/features/<zone>`; `app/` routes become thin re-export shells. ESLint `no-restricted-imports` blocks enforce boundaries last.

**Tech Stack:** Next.js 16 (app router), TypeScript, Supabase SSR, Jest, ESLint flat config, GitHub Actions, `gh` CLI.

**Spec:** `docs/superpowers/specs/2026-08-13-zone-ownership-repo-prep-design.md`

## Global Constraints

- All npm/file commands run from `client/` unless the path starts with `.github/` or `docs/`.
- Green gate after every task: `npm run typecheck && npm run lint && npm test` must pass before commit. Task 13 adds `npm run build`.
- No new npm dependencies anywhere in this plan.
- The `@/*` → `./src/*` alias already covers `@/shared/*` and `@/features/*`. Do NOT add tsconfig paths.
- Use `git mv` for every move. Use the `remap` helper (Task 1) for import rewrites — never BSD `sed -i` (macOS). `remap` must also rewrite `tests/**` because tests mock modules by path string (`jest.mock('@/components/...')`).
- When moving a file, first check its imports (`grep "^import" <file>`): relative imports must be fixed to the new location; if a file destined for `shared/` imports feature-only code, stop and flag it — shared may never depend on features.
- When thinning a page to a shell, first run `grep -nE "export (const|async function) (metadata|generateMetadata|dynamic|revalidate|runtime)" <page>` and re-export every hit alongside `default`.
- Each task ends with one commit; message format given per task. Append `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- One in-flight caveat: if `npm test` fails BEFORE any change in Task 1, stop — the baseline must be green first.

## Zone → path map (target state, reference for all tasks)

| Zone | Paths |
|---|---|
| Design system | `src/shared/ui/`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/not-found.tsx`, `src/app/dev/` |
| Platform | `src/shared/lib/`, `src/middleware.ts` |
| DevEx / CI-CD | `.github/`, `client/*.config.*`, `client/eslint.config.mjs`, `client/tsconfig.json`, `client/jest.*`, `docs/` |
| Public site | `src/features/public-site/`, its `app/` shells (`page.tsx`, `departments`, `projects`, `sponsors`, `blog`, `startups`, `ai2`, `eigenai`, `ml-fundamentals`, `api/umami`), `src/assets/` |
| Recruitment | `src/features/recruitment/`, shells `apply`, `applicants`, `admin`, `api/applications`, `api/apply`, `api/drive_upload` |
| Careers | `src/features/careers/`, shell `careers` |
| Events | `src/features/events/`, shell `events` |
| Members | `src/features/members/`, shells `auth`, `profile`, `dashboard`, `api/auth` |

---

### Task 1: Move Supabase core into `shared/lib/supabase`

**Files:**
- Move: `src/lib/supabase/client.ts` → `src/shared/lib/supabase/client.ts`
- Move: `src/lib/supabase/server.ts` → `src/shared/lib/supabase/server.ts`
- Move: `src/utils/supabase/middleware.ts` → `src/shared/lib/supabase/middleware.ts`
- Modify: `src/middleware.ts` (import path), all importers of the moved files

**Interfaces:**
- Produces: `@/shared/lib/supabase/client` exporting `supabase`, `createSupabaseBrowserClient`; `@/shared/lib/supabase/server` exporting `createClient`; `@/shared/lib/supabase/middleware` exporting `updateSession`. Signatures unchanged from the source files.

- [ ] **Step 1: Verify green baseline**

Run: `npm run typecheck && npm run lint && npm test`
Expected: PASS. If not, STOP and report.

- [ ] **Step 2: Define the remap helper** (re-declare at the start of every later task's shell too)

```bash
remap() {
  grep -rl --include='*.ts' --include='*.tsx' --include='*.jsx' "$1" src tests jest.setup.js 2>/dev/null \
    | while read -r f; do perl -pi -e "s|\Q$1\E|$2|g" "$f"; done
}
```

- [ ] **Step 3: Move files and rewrite importers**

```bash
mkdir -p src/shared/lib/supabase
git mv src/lib/supabase/client.ts src/shared/lib/supabase/client.ts
git mv src/lib/supabase/server.ts src/shared/lib/supabase/server.ts
git mv src/utils/supabase/middleware.ts src/shared/lib/supabase/middleware.ts
rmdir src/lib/supabase src/utils/supabase
remap '@/lib/supabase/client' '@/shared/lib/supabase/client'
remap '@/lib/supabase/server' '@/shared/lib/supabase/server'
remap './utils/supabase/middleware' './shared/lib/supabase/middleware'
remap '@/utils/supabase/middleware' '@/shared/lib/supabase/middleware'
```

- [ ] **Step 4: Verify no stale references**

Run: `grep -rn "lib/supabase\|utils/supabase" src tests jest.setup.js | grep -v shared/lib/supabase`
Expected: no output.

- [ ] **Step 5: Green gate, then commit**

Run: `npm run typecheck && npm run lint && npm test`
Commit: `refactor(platform): move supabase core into shared/lib`

---

### Task 2: Consolidate auth into `shared/lib/auth`

**Files:**
- Move: `src/lib/auth/guards.ts` → `src/shared/lib/auth/guards.ts`
- Move: `src/utils/auth.ts` → `src/shared/lib/auth/client.ts`
- Move: `src/utils/user.ts` → `src/shared/lib/auth/user.ts`
- Move: `src/hooks/useUser.ts` → `src/shared/lib/hooks/useUser.ts`
- Move: `src/types/auth.ts` → `src/shared/lib/auth/types.ts`

**Interfaces:**
- Produces: `@/shared/lib/auth/guards` (server: `getCurrentUser`, `getAdminUser`, `requireUser`, `requireAdmin`); `@/shared/lib/auth/client` (browser: `getCurrentUser`, `getUserProfile`, `isAuthenticated`, `register`, `login`, `signInWithGoogle`, `logout`, `resetPassword`, `resendConfirmation`, `updateProfile`, `onAuthStateChange`, `AUTH_ERRORS`); `@/shared/lib/auth/user` (`getUserById`, `getCurrentUserProfile`, `updateUserProfile`, `createUserProfile`); `@/shared/lib/auth/types` (`UserProfile`, `AuthUser`); `@/shared/lib/hooks/useUser` (`useUser`).
- Note: the two `getCurrentUser`s (guards = server profile row; client = auth metadata) intentionally stay separate — Task 4's separate server/client barrels prevent the name collision.

- [ ] **Step 1: Move and rewrite**

```bash
mkdir -p src/shared/lib/auth src/shared/lib/hooks
git mv src/lib/auth/guards.ts src/shared/lib/auth/guards.ts
git mv src/utils/auth.ts src/shared/lib/auth/client.ts
git mv src/utils/user.ts src/shared/lib/auth/user.ts
git mv src/hooks/useUser.ts src/shared/lib/hooks/useUser.ts
git mv src/types/auth.ts src/shared/lib/auth/types.ts
rmdir src/lib/auth
remap '@/lib/auth/guards' '@/shared/lib/auth/guards'
remap '@/utils/auth' '@/shared/lib/auth/client'
remap '@/utils/user' '@/shared/lib/auth/user'
remap '@/hooks/useUser' '@/shared/lib/hooks/useUser'
remap '@/types/auth' '@/shared/lib/auth/types'
```

- [ ] **Step 2: Verify no stale references**

Run: `grep -rn "lib/auth\|utils/auth\|utils/user\|hooks/useUser\|types/auth" src tests | grep -v shared/lib`
Expected: no output (a comment in `shared/lib/supabase/middleware.ts` mentions `lib/auth/guards.ts` — update that comment to `shared/lib/auth/guards.ts`).

- [ ] **Step 3: Green gate, then commit**

Run: `npm run typecheck && npm run lint && npm test`
Commit: `refactor(platform): consolidate auth modules into shared/lib/auth`

---

### Task 3: Move storage, validation, and `cn` into `shared/lib`

**Files:**
- Move: `src/lib/google-drive.ts` → `src/shared/lib/storage/google-drive.ts`
- Move: `src/utils/upload.ts` → `src/shared/lib/storage/upload.ts`
- Move: `src/utils/validation.ts` → `src/shared/lib/validation.ts`
- Move: `src/lib/utils.ts` → `src/shared/lib/utils.ts`
- Move: `src/hooks/useLeaderboard.ts` → stays for now (public-site-bound; moves in Task 10)
- Modify: `components.json` (shadcn aliases)

**Interfaces:**
- Produces: `@/shared/lib/storage/google-drive`, `@/shared/lib/storage/upload`, `@/shared/lib/validation`, `@/shared/lib/utils` (exports `cn`). Signatures unchanged.

- [ ] **Step 1: Move and rewrite**

```bash
mkdir -p src/shared/lib/storage
git mv src/lib/google-drive.ts src/shared/lib/storage/google-drive.ts
git mv src/utils/upload.ts src/shared/lib/storage/upload.ts
git mv src/utils/validation.ts src/shared/lib/validation.ts
git mv src/lib/utils.ts src/shared/lib/utils.ts
rmdir src/lib src/utils
remap '@/lib/google-drive' '@/shared/lib/storage/google-drive'
remap '@/utils/upload' '@/shared/lib/storage/upload'
remap '@/utils/validation' '@/shared/lib/validation'
remap '@/lib/utils' '@/shared/lib/utils'
```

- [ ] **Step 2: Update `components.json`** — in the `aliases` object set `"utils": "@/shared/lib/utils"` and leave other keys for Task 5 to update.

- [ ] **Step 3: Verify `src/lib` and `src/utils` are gone**

Run: `ls src/lib src/utils 2>&1; grep -rn "@/lib/\|@/utils/" src tests | grep -v shared`
Expected: "No such file or directory" twice; grep empty.

- [ ] **Step 4: Green gate, then commit**

Run: `npm run typecheck && npm run lint && npm test`
Commit: `refactor(platform): move storage, validation, cn into shared/lib`

---

### Task 4: Platform barrels — `@/shared/lib`, `@/shared/lib/client`, `@/shared/lib/server`

**Files:**
- Create: `src/shared/lib/index.ts`, `src/shared/lib/client.ts`, `src/shared/lib/server.ts`
- Modify: every importer of `@/shared/lib/<deep path>` OUTSIDE `src/shared/` and outside `src/middleware.ts` (rewrite to the matching barrel)

**Interfaces:**
- Produces (these are the ONLY platform entry points features may use from here on):
  - `@/shared/lib` — universal: `UserProfile`, `AuthUser`, everything from `validation`, `cn`
  - `@/shared/lib/client` — browser: `supabase`, `createSupabaseBrowserClient`, all of `auth/client`, all of `auth/user`, all of `storage/upload`, `useUser`
  - `@/shared/lib/server` — server-only: `createClient`, `updateSession`, all of `auth/guards`, all of `storage/google-drive`
- `src/middleware.ts` keeps its deep import of `@/shared/lib/supabase/middleware` (edge bundle must not pull googleapis); it is platform-owned, so this is allowed.

- [ ] **Step 1: Write the three barrels**

```ts
// src/shared/lib/index.ts — universal platform API (safe in server and client code)
export * from "./auth/types";
export * from "./validation";
export { cn } from "./utils";
```

```ts
// src/shared/lib/client.ts — browser platform API
export { supabase, createSupabaseBrowserClient } from "./supabase/client";
export * from "./auth/client";
export * from "./auth/user";
export * from "./storage/upload";
export { useUser } from "./hooks/useUser";
```

```ts
// src/shared/lib/server.ts — server-only platform API
export { createClient } from "./supabase/server";
export { updateSession } from "./supabase/middleware";
export * from "./auth/guards";
export * from "./storage/google-drive";
```

If typecheck reports an export-name collision from an `export *`, replace that line with explicit named exports of the module's actual public functions.

- [ ] **Step 2: Rewrite outside importers to barrels**

For each file under `src/app`, `src/components`, `tests` (NOT `src/shared`, NOT `src/middleware.ts`):
- `@/shared/lib/auth/guards` → `@/shared/lib/server`
- `@/shared/lib/supabase/server` → `@/shared/lib/server` (import stays `{ createClient }`)
- `@/shared/lib/storage/google-drive` → `@/shared/lib/server`
- `@/shared/lib/auth/client` → `@/shared/lib/client`
- `@/shared/lib/auth/user` → `@/shared/lib/client`
- `@/shared/lib/supabase/client` → `@/shared/lib/client`
- `@/shared/lib/storage/upload` → `@/shared/lib/client`
- `@/shared/lib/hooks/useUser` → `@/shared/lib/client`
- `@/shared/lib/auth/types` → `@/shared/lib`
- `@/shared/lib/validation` → `@/shared/lib`
- `@/shared/lib/utils` → `@/shared/lib`

Use `remap` variants scoped by hand-checking: after running the remaps, `grep -rn "@/shared/lib/" src tests | grep -vE "src/shared|src/middleware.ts|@/shared/lib/(client|server)[\"']|@/shared/lib[\"']"` must return nothing. If a single import line mixed symbols that now live in different barrels, split it into two import lines manually.

CAUTION: `tests/` mock the deep paths (e.g. `jest.mock('@/lib/supabase/client')` became `@/shared/lib/supabase/client` in Task 1). Tests must now mock the barrel the code under test actually imports (`@/shared/lib/client` etc.). Update each `jest.mock` path and keep the factory shape unchanged; run the specific test file after each edit.

- [ ] **Step 3: Green gate, then commit**

Run: `npm run typecheck && npm run lint && npm test`
Commit: `refactor(platform): expose shared/lib via universal, client, and server barrels`

---

### Task 5: Stand up `shared/ui` with barrel

**Files:**
- Move (flat into `src/shared/ui/`): `src/components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `dropdown.tsx`, plus `src/components/navbar.tsx`, `footer.tsx`, `theme-provider.tsx`, `theme-toggle.tsx`, `floating-theme-toggle.tsx`, `scrollToTop.tsx`, `heroSection.tsx`
- Create: `src/shared/ui/index.ts`
- Modify: all importers (including `src/app/layout.tsx`, tests mocking `@/components/navbar` etc.), `components.json`

**Interfaces:**
- Produces: `@/shared/ui` barrel — sole entry point for design-system components. Contents: the shadcn primitives (named exports, `export *`) and default-export components re-exported as `export { default as Navbar } from "./navbar"` (same pattern for `Footer`, `ThemeProvider`, `ThemeToggle`, `FloatingThemeToggle`, `ScrollToTop`, `HeroSection` — verify each file's actual export form first and match it; typecheck is the arbiter).
- `heroSection.tsx` moves because events, careers, blog, projects, sponsors, ml-fundamentals pages all use it (cross-zone). If it imports any `@/components/*` file, that dependency moves into `shared/ui` too.

- [ ] **Step 1: Move files**

```bash
mkdir -p src/shared/ui
for f in button input textarea select dropdown; do git mv "src/components/ui/$f.tsx" "src/shared/ui/$f.tsx"; done
rmdir src/components/ui
for f in navbar footer theme-provider theme-toggle floating-theme-toggle scrollToTop heroSection; do git mv "src/components/$f.tsx" "src/shared/ui/$f.tsx"; done
```

- [ ] **Step 2: Rewrite importers to the barrel**

First remap deep paths (`remap '@/components/ui/button' '@/shared/ui/button'` … for all five primitives, then `remap '@/components/navbar' '@/shared/ui/navbar'` … for all seven components; also fix any relative imports among the moved files themselves to `./name`). Then write `src/shared/ui/index.ts` per the Interfaces block. Then rewrite every importer OUTSIDE `src/shared/ui` from `@/shared/ui/<file>` to `@/shared/ui`, merging import lines. Tests that `jest.mock('@/shared/ui/navbar')`-style paths: mock `@/shared/ui` instead with a factory returning the same component stubs (use `jest.requireActual` for untouched exports: `{ ...jest.requireActual('@/shared/ui'), Navbar: MockNavbar }`).

- [ ] **Step 3: Verify**

Run: `grep -rn "@/components/ui\|@/components/navbar\|@/components/footer\|@/components/theme\|@/components/scrollToTop\|@/components/heroSection\|@/components/floating" src tests`
Expected: no output. Update `components.json` aliases: `"ui": "@/shared/ui"`, `"components": "@/shared/ui"`.

- [ ] **Step 4: Green gate, then commit**

Run: `npm run typecheck && npm run lint && npm test`
Commit: `refactor(design-system): stand up shared/ui with barrel`

---

### Task 6: `features/members` (auth, profile, dashboard)

**Files:**
- Move pages: `src/app/auth/page.tsx` → `src/features/members/pages/auth.tsx`; `src/app/auth/reset-password/page.tsx` → `pages/reset-password.tsx`; `src/app/profile/page.tsx` → `pages/profile.tsx`; `src/app/dashboard/page.tsx` → `pages/dashboard.tsx`
- Move api: `src/app/auth/callback/route.ts` → `src/features/members/api/auth-callback.ts`; `src/app/api/auth/set-cookie/route.ts` → `api/set-cookie.ts`; `src/app/api/auth/signout/route.ts` → `api/signout.ts`
- Move components: `src/components/profile/*.tsx` (all 8) → `src/features/members/components/`
- Create: thin shells at each original `page.tsx`/`route.ts` path
- Modify: test mock paths (`@/components/profile/*`)

**Interfaces:**
- Consumes: `@/shared/lib`, `@/shared/lib/client`, `@/shared/lib/server`, `@/shared/ui` (Task 4/5 barrels).
- Produces: `@/features/members/pages/{auth,reset-password,profile,dashboard}` default exports; `@/features/members/api/{auth-callback,set-cookie,signout}` re-exporting the original HTTP method handlers.

- [ ] **Step 1: Move pages and create shells**

For each page: check for metadata/dynamic exports per Global Constraints, `git mv`, then write the shell, e.g.:

```ts
// src/app/profile/page.tsx
export { default } from "@/features/members/pages/profile";
```

For each route: check exported methods (`grep -nE "export (async )?function (GET|POST|PUT|PATCH|DELETE)" <file>`), `git mv`, shell e.g.:

```ts
// src/app/api/auth/signout/route.ts
export { POST } from "@/features/members/api/signout";
```

(Adjust the named exports to what each file actually exports.)

- [ ] **Step 2: Move profile components and remap**

```bash
mkdir -p src/features/members/components
git mv src/components/profile src/features/members/components/profile
remap '@/components/profile/' '@/features/members/components/profile/'
```

- [ ] **Step 3: Verify + green gate + commit**

Run: `grep -rn "@/components/profile" src tests` → empty; `npm run typecheck && npm run lint && npm test`
Commit: `refactor(members): move auth, profile, dashboard into features/members`

---

### Task 7: `features/recruitment` (apply, applicants, admin)

**Files:**
- Move pages/client components: `src/app/apply/page.tsx` → `src/features/recruitment/pages/apply.tsx`; `src/app/applicants/page.tsx` → `pages/applicants.tsx`; `src/app/applicants/ApplicantsPageClient.tsx` → `components/ApplicantsPageClient.tsx`; `src/app/applicants/[profile]/page.tsx` → `pages/applicant-profile.tsx`; `src/app/applicants/[profile]/ApplicantProfileClient.tsx` → `components/ApplicantProfileClient.tsx`; `src/app/admin/page.tsx` → `pages/admin.tsx`; `src/app/admin/AdminPageClient.tsx` → `components/AdminPageClient.tsx`; `src/app/admin/AddCalendly.tsx` → `components/AddCalendly.tsx`; `src/components/admin/ApplicantRow.tsx` → `components/ApplicantRow.tsx`
- Move api: `src/app/api/applications/route.ts` → `api/applications.ts`; `src/app/api/apply/route.ts` → `api/apply.ts`; `src/app/api/drive_upload/route.ts` → `api/drive-upload.ts`
- Move types: `src/types/apply.ts` → `src/features/recruitment/types/apply.ts`; `src/types/admin.ts` → `types/admin.ts`
- Create: shells at all original route paths

**Interfaces:**
- Consumes: shared barrels only.
- Produces: `@/features/recruitment/pages/{apply,applicants,applicant-profile,admin}`, `.../api/{applications,apply,drive-upload}`, `.../types/{apply,admin}`.

- [ ] **Step 1: Move + shells** — same shell pattern as Task 6. The `[profile]` dynamic page shell must re-export everything the page needs (default + any `generateMetadata`/params typing). Client components moved out of `app/` keep their `"use client"` directives.

```bash
mkdir -p src/features/recruitment/{pages,components,api,types}
# pages/components/api moves per the Files list above, then:
git mv src/components/admin/ApplicantRow.tsx src/features/recruitment/components/ApplicantRow.tsx
rmdir src/components/admin
git mv src/types/apply.ts src/features/recruitment/types/apply.ts
git mv src/types/admin.ts src/features/recruitment/types/admin.ts
remap '@/app/applicants/ApplicantsPageClient' '@/features/recruitment/components/ApplicantsPageClient'
remap '@/app/applicants/\[profile\]/ApplicantProfileClient' '@/features/recruitment/components/ApplicantProfileClient'
remap '@/app/admin/AdminPageClient' '@/features/recruitment/components/AdminPageClient'
remap '@/app/admin/AddCalendly' '@/features/recruitment/components/AddCalendly'
remap '@/components/admin/ApplicantRow' '@/features/recruitment/components/ApplicantRow'
remap '@/types/apply' '@/features/recruitment/types/apply'
remap '@/types/admin' '@/features/recruitment/types/admin'
```

(Note: the `[profile]` remap pattern contains literal brackets — since `remap` uses `\Q..\E`, pass the path as it appears in source: `@/app/applicants/[profile]/ApplicantProfileClient`. Check actual import strings first with `grep -rn "ApplicantProfileClient" src tests`. Relative imports like `./ApplicantsPageClient` inside moved pages must be updated by hand.)

- [ ] **Step 2: Verify + green gate + commit**

Run: `grep -rn "@/components/admin\|@/types/apply\|@/types/admin\|app/admin/A\|ApplicantsPageClient\|ApplicantProfileClient" src tests | grep -v features/recruitment` → only shell files may appear; `npm run typecheck && npm run lint && npm test`
Commit: `refactor(recruitment): move applicant portal into features/recruitment`

---

### Task 8: `features/events`

**Files:**
- Move: `src/app/events/components/` (5 files) → `src/features/events/components/`; `src/app/events/api/events.ts` → `src/features/events/api/events.ts`; `src/app/events/page.tsx` → `src/features/events/pages/events.tsx`
- Create: shell `src/app/events/page.tsx`

**Interfaces:**
- Consumes: shared barrels; `HeroSection` from `@/shared/ui`.
- Produces: `@/features/events/pages/events`, `@/features/events/api/events`, `@/features/events/components/*`.

- [ ] **Step 1: Move + shell + remap**

```bash
mkdir -p src/features/events/pages
git mv src/app/events/components src/features/events/components
git mv src/app/events/api src/features/events/api
git mv src/app/events/page.tsx src/features/events/pages/events.tsx
remap '@/app/events/components' '@/features/events/components'
remap '@/app/events/api/events' '@/features/events/api/events'
```

Fix relative imports inside `pages/events.tsx` (e.g. `./components/event-card` → `../components/event-card` or `@/features/events/components/event-card` — prefer the alias form). Write the shell with any metadata re-exports.

- [ ] **Step 2: Verify + green gate + commit**

Run: `grep -rn "@/app/events" src tests` → only the shell; `npm run typecheck && npm run lint && npm test`
Commit: `refactor(events): move events surface into features/events`

---

### Task 9: `features/careers`

**Files:**
- Move: `src/app/careers/page.tsx` → `src/features/careers/pages/careers.tsx`; `src/types/careers.ts` → `src/features/careers/types.ts`
- Create: shell `src/app/careers/page.tsx`

**Interfaces:**
- Consumes: shared barrels; `HeroSection` from `@/shared/ui`; `src/assets/careers.json` (stays in `src/assets/` — CODEOWNERS covers it file-level in Task 12).
- Produces: `@/features/careers/pages/careers`, `@/features/careers/types`.

- [ ] **Step 1: Move + shell + remap**

```bash
mkdir -p src/features/careers/pages
git mv src/app/careers/page.tsx src/features/careers/pages/careers.tsx
git mv src/types/careers.ts src/features/careers/types.ts
remap '@/types/careers' '@/features/careers/types'
```

Shell + metadata check per Global Constraints.

- [ ] **Step 2: Verify + green gate + commit**

Run: `npm run typecheck && npm run lint && npm test`
Commit: `refactor(careers): move job postings surface into features/careers`

---

### Task 10: `features/public-site` (everything remaining)

**Files:**
- Move pages → `src/features/public-site/pages/`: `src/app/page.tsx` → `home.tsx`; `departments/page.tsx` → `departments.tsx`; `projects/page.tsx` → `projects.tsx`; `sponsors/page.tsx` → `sponsors.tsx`; `blog/page.tsx` → `blog.tsx`; `startups/page.tsx` → `startups.tsx`; `ai2/page.tsx` → `ai2.tsx`; `eigenai/page.tsx` → `eigenai.tsx`; `ml-fundamentals/page.tsx` → `ml-fundamentals.tsx`
- Move data → `src/features/public-site/data/`: `src/app/ai2/data.tsx` → `ai2.tsx`; `src/app/eigenai/data.ts` → `eigenai.ts`; `src/app/ml-fundamentals/data.ts` → `ml-fundamentals.ts`
- Move api → `src/features/public-site/api/`: `src/app/blog/api/blog.ts` → `blog.ts`; `src/app/api/umami/overview/route.ts` → `umami-overview.ts` (+ shell)
- Move ALL remaining `src/components/*` → `src/features/public-site/components/` (valueprops, stats, faq, sponsors, startupsSection, workshops, events, lambda, memberList, peopleGrid, carousel, Leaderboard, `cards/` dir, `slider/` dir, `projects/project-modal.tsx`)
- Move: `src/hooks/useLeaderboard.ts` → `src/features/public-site/hooks/useLeaderboard.ts`
- Move types → `src/features/public-site/types/`: `src/types/ai2.ts`, `Blog.ts`, `projects.ts`, `startups.ts`, `react-chrono.d.ts`, and `src/app/types/home.ts` → `home.ts`
- Create: shells at all 9 page paths + umami route
- Modify: `tsconfig.json` include entry for slider

**Interfaces:**
- Consumes: shared barrels; `src/assets/*`.
- Produces: nothing other zones may consume (boundary lint enforces this from Task 11 on).

- [ ] **Step 1: Move pages/data/api with shells** — same patterns as Tasks 6–8. `src/app/page.tsx` shell: `export { default } from "@/features/public-site/pages/home";` (plus metadata re-exports found by the Global Constraints grep).

Remaps: `remap '@/app/ai2/data' '@/features/public-site/data/ai2'`, same for `eigenai/data`, `ml-fundamentals/data`, `remap '@/app/blog/api/blog' '@/features/public-site/api/blog'`, `remap '@/app/types/home' '@/features/public-site/types/home'`.

- [ ] **Step 2: Move remaining components wholesale**

```bash
mkdir -p src/features/public-site/{components,hooks,types}
for f in valueprops stats faq sponsors startupsSection workshops events lambda memberList peopleGrid carousel Leaderboard; do
  git mv "src/components/$f.tsx" "src/features/public-site/components/$f.tsx"
  remap "@/components/$f" "@/features/public-site/components/$f"
done
git mv src/components/cards src/features/public-site/components/cards
git mv src/components/slider src/features/public-site/components/slider
git mv src/components/projects/project-modal.tsx src/features/public-site/components/project-modal.tsx
rmdir src/components/projects
remap '@/components/cards/' '@/features/public-site/components/cards/'
remap '@/components/slider/' '@/features/public-site/components/slider/'
remap '@/components/projects/project-modal' '@/features/public-site/components/project-modal'
git mv src/hooks/useLeaderboard.ts src/features/public-site/hooks/useLeaderboard.ts
rmdir src/hooks
remap '@/hooks/useLeaderboard' '@/features/public-site/hooks/useLeaderboard'
for t in ai2 Blog projects startups; do git mv "src/types/$t.ts" "src/features/public-site/types/$t.ts"; remap "@/types/$t" "@/features/public-site/types/$t"; done
git mv src/types/react-chrono.d.ts src/features/public-site/types/react-chrono.d.ts
rmdir src/types src/app/types 2>/dev/null || true
```

Fix intra-feature relative imports the moves broke (e.g. `events.tsx` → `./cards/events-card` still resolves; `project-card.tsx` → `project-modal` path needs checking). In `tsconfig.json` `include`, change `"src/components/slider/slider.jsx"` → `"src/features/public-site/components/slider/slider.jsx"` and drop the now-dead `"src/types"` entry.

- [ ] **Step 3: Prove completeness**

Run: `ls src/components src/hooks src/types 2>&1`
Expected: "No such file or directory" three times. `src/app` now contains only shells, `layout.tsx`, `globals.css`, `not-found.tsx`, `dev/`, and route dirs.

- [ ] **Step 4: Green gate, then commit**

Run: `npm run typecheck && npm run lint && npm test`
Commit: `refactor(public-site): move public surfaces into features/public-site`

---

### Task 11: Boundary lint

**Files:**
- Modify: `client/eslint.config.mjs`

**Interfaces:**
- Consumes: the finished `features/` + `shared/` layout.
- Produces: lint errors on (a) feature→feature imports, (b) feature deep-imports into shared internals, (c) shared→feature imports.

- [ ] **Step 1: Write a failing case first** — create `src/features/careers/lint-canary.ts` containing `import "@/features/events/api/events";` and `import "@/shared/lib/auth/guards";`. Run `npm run lint`: currently PASSES (proves the gap).

- [ ] **Step 2: Add boundary blocks to `eslint.config.mjs`** (append before the final export):

```js
// --- Zone boundaries (see docs/ZONES.md) -----------------------------------
// Features may import shared barrels, never other features and never shared
// internals. Shared may never import features. docs/superpowers/specs/
// 2026-08-13-zone-ownership-repo-prep-design.md is the source of truth.
const ZONE_FEATURES = ["public-site", "recruitment", "careers", "events", "members"];

const SHARED_BARRELS_ONLY = {
  group: [
    "@/shared/ui/*",
    "@/shared/lib/*",
    "!@/shared/lib/client",
    "!@/shared/lib/server",
  ],
  message:
    "Import the barrels (@/shared/ui, @/shared/lib, @/shared/lib/client, @/shared/lib/server), not shared internals.",
};

const zoneBoundaryRules = ZONE_FEATURES.map((feature) => ({
  files: [`src/features/${feature}/**`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ZONE_FEATURES.filter((f) => f !== feature).flatMap((f) => [
              `@/features/${f}`,
              `@/features/${f}/*`,
            ]),
            message:
              "Features may not import other features. Promote genuinely shared code to @/shared (platform/design-system owners review it).",
          },
          SHARED_BARRELS_ONLY,
        ],
      },
    ],
  },
}));

const sharedBoundaryRule = {
  files: ["src/shared/**"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/features/*"],
            message: "Shared code may never depend on features.",
          },
        ],
      },
    ],
  },
};

const appBarrelRule = {
  files: ["src/app/**"],
  ignores: ["src/app/api/**"],
  rules: {
    "no-restricted-imports": ["error", { patterns: [SHARED_BARRELS_ONLY] }],
  },
};
```

and spread `...zoneBoundaryRules, sharedBoundaryRule, appBarrelRule` into the exported config array. (If the `ignores` key placement errors under flat config, fold `src/app/api/**` into `files` globs instead — lint output is the arbiter.)

- [ ] **Step 3: Verify the canary now FAILS** — `npm run lint` must report both canary imports as `no-restricted-imports` errors. Then delete `src/features/careers/lint-canary.ts`.

- [ ] **Step 4: Fix any real violations the new rules surface** (deep shared imports missed in Tasks 4–10). `src/middleware.ts` is outside `src/features` and `src/app`, so its deep import stays legal.

- [ ] **Step 5: Green gate, then commit**

Run: `npm run typecheck && npm run lint && npm test`
Commit: `feat(devex): enforce zone import boundaries in lint`

---

### Task 12: Ownership plumbing — ZONES.md, CODEOWNERS, labels, templates

**Files:**
- Create: `docs/ZONES.md`, `.github/CODEOWNERS`, `.github/labeler.yml`, `.github/workflows/zone-label.yml`, `.github/ISSUE_TEMPLATE/task.yml`, `.github/workflows/zone-label-issues.yml`

**Interfaces:**
- Consumes: the final path layout (Tasks 1–10) and zone names (`design-system`, `platform`, `devex`, `public-site`, `recruitment`, `careers`, `events`, `members`).
- Produces: PRs auto-labeled `zone:<name>` by path; issues labeled from the template dropdown; CODEOWNERS review routing.

- [ ] **Step 1: Write `docs/ZONES.md`** — one section per zone: mission (2-3 sentences pulled from the spec's zone table), paths (copy the plan's Zone → path map, final state), `Owner: TBD`, and the import rules + "how work flows" paragraph (issue → zone label → board lane → PR → auto review request) from the spec's success criteria.

- [ ] **Step 2: Write `.github/CODEOWNERS`** (placeholder owner `@Eeetan` on every line until zones are assigned; one block per zone):

```
# Zone ownership — see docs/ZONES.md. Placeholder owner until zones are assigned.

# Design system
/client/src/shared/ui/ @Eeetan
/client/src/app/layout.tsx @Eeetan
/client/src/app/globals.css @Eeetan
/client/src/app/not-found.tsx @Eeetan
/client/src/app/dev/ @Eeetan

# Platform
/client/src/shared/lib/ @Eeetan
/client/src/middleware.ts @Eeetan

# DevEx / CI-CD
/.github/ @Eeetan
/docs/ @Eeetan
/client/eslint.config.mjs @Eeetan
/client/tsconfig.json @Eeetan
/client/jest.config.js @Eeetan
/client/jest.setup.js @Eeetan
/client/next.config.ts @Eeetan
/client/package.json @Eeetan

# Public site
/client/src/features/public-site/ @Eeetan
/client/src/assets/ @Eeetan
/client/src/app/page.tsx @Eeetan
/client/src/app/departments/ @Eeetan
/client/src/app/projects/ @Eeetan
/client/src/app/sponsors/ @Eeetan
/client/src/app/blog/ @Eeetan
/client/src/app/startups/ @Eeetan
/client/src/app/ai2/ @Eeetan
/client/src/app/eigenai/ @Eeetan
/client/src/app/ml-fundamentals/ @Eeetan
/client/src/app/api/umami/ @Eeetan

# Recruitment
/client/src/features/recruitment/ @Eeetan
/client/src/app/apply/ @Eeetan
/client/src/app/applicants/ @Eeetan
/client/src/app/admin/ @Eeetan
/client/src/app/api/applications/ @Eeetan
/client/src/app/api/apply/ @Eeetan
/client/src/app/api/drive_upload/ @Eeetan

# Careers
/client/src/features/careers/ @Eeetan
/client/src/assets/careers.json @Eeetan

# Events
/client/src/features/events/ @Eeetan
/client/src/app/events/ @Eeetan

# Members
/client/src/features/members/ @Eeetan
/client/src/app/auth/ @Eeetan
/client/src/app/profile/ @Eeetan
/client/src/app/dashboard/ @Eeetan
/client/src/app/api/auth/ @Eeetan
```

- [ ] **Step 3: Write `.github/labeler.yml`** — same paths as CODEOWNERS, keyed by label:

```yaml
"zone: design-system":
  - changed-files:
      - any-glob-to-any-file:
          - client/src/shared/ui/**
          - client/src/app/layout.tsx
          - client/src/app/globals.css
          - client/src/app/not-found.tsx
          - client/src/app/dev/**
"zone: platform":
  - changed-files:
      - any-glob-to-any-file:
          - client/src/shared/lib/**
          - client/src/middleware.ts
"zone: devex":
  - changed-files:
      - any-glob-to-any-file:
          - .github/**
          - docs/**
          - client/eslint.config.mjs
          - client/tsconfig.json
          - client/jest.config.js
          - client/jest.setup.js
          - client/next.config.ts
          - client/package.json
"zone: public-site":
  - changed-files:
      - any-glob-to-any-file:
          - client/src/features/public-site/**
          - client/src/assets/**
          - client/src/app/page.tsx
          - client/src/app/departments/**
          - client/src/app/projects/**
          - client/src/app/sponsors/**
          - client/src/app/blog/**
          - client/src/app/startups/**
          - client/src/app/ai2/**
          - client/src/app/eigenai/**
          - client/src/app/ml-fundamentals/**
          - client/src/app/api/umami/**
"zone: recruitment":
  - changed-files:
      - any-glob-to-any-file:
          - client/src/features/recruitment/**
          - client/src/app/apply/**
          - client/src/app/applicants/**
          - client/src/app/admin/**
          - client/src/app/api/applications/**
          - client/src/app/api/apply/**
          - client/src/app/api/drive_upload/**
"zone: careers":
  - changed-files:
      - any-glob-to-any-file:
          - client/src/features/careers/**
          - client/src/assets/careers.json
"zone: events":
  - changed-files:
      - any-glob-to-any-file:
          - client/src/features/events/**
          - client/src/app/events/**
"zone: members":
  - changed-files:
      - any-glob-to-any-file:
          - client/src/features/members/**
          - client/src/app/auth/**
          - client/src/app/profile/**
          - client/src/app/dashboard/**
          - client/src/app/api/auth/**
```

- [ ] **Step 4: Write `.github/workflows/zone-label.yml`**:

```yaml
name: Label PR zone

on:
  pull_request_target:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: write
  contents: read

jobs:
  label-zone:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v5
        with:
          sync-labels: true
```

- [ ] **Step 5: Write `.github/ISSUE_TEMPLATE/task.yml` and `.github/workflows/zone-label-issues.yml`**:

```yaml
# .github/workflows/zone-label-issues.yml
name: Label issue zone

on:
  issues:
    types: [opened, edited]

permissions:
  issues: write

jobs:
  label-zone:
    runs-on: ubuntu-latest
    steps:
      - name: Apply zone label from template dropdown
        uses: actions/github-script@v8
        with:
          script: |
            const zones = [
              "design-system", "platform", "devex", "public-site",
              "recruitment", "careers", "events", "members",
            ];
            const body = context.payload.issue.body || "";
            // Issue forms render the dropdown as "### Zone\n\n<value>"
            const match = body.match(/### Zone\s*\n+\s*(.+)/);
            const chosen = match ? match[1].trim() : null;
            const newLabel = zones.includes(chosen) ? `zone: ${chosen}` : null;

            const { owner, repo } = context.repo;
            const issue_number = context.payload.issue.number;
            const current = context.payload.issue.labels.map((l) => l.name);

            for (const z of zones) {
              const label = `zone: ${z}`;
              if (current.includes(label) && label !== newLabel) {
                await github.rest.issues.removeLabel({ owner, repo, issue_number, name: label });
              }
            }
            if (newLabel && !current.includes(newLabel)) {
              await github.rest.issues.addLabels({ owner, repo, issue_number, labels: [newLabel] });
            }
```

```yaml
# .github/ISSUE_TEMPLATE/task.yml
name: Task
description: A scoped piece of work for a zone
title: "[task]: "
body:
  - type: dropdown
    id: zone
    attributes:
      label: Zone
      description: Which zone does this belong to? (see docs/ZONES.md)
      options:
        - design-system
        - platform
        - devex
        - public-site
        - recruitment
        - careers
        - events
        - members
        - not sure
    validations:
      required: true
  - type: textarea
    id: what
    attributes:
      label: What needs to happen
      description: Scope it so one person can own it end-to-end.
    validations:
      required: true
  - type: textarea
    id: done
    attributes:
      label: Definition of done
    validations:
      required: false
```

- [ ] **Step 6: Create the labels** (needs `gh` auth; labels are idempotent — `|| true` on exists):

```bash
for z in design-system platform devex public-site recruitment careers events members; do
  gh label create "zone: $z" --color 1D76DB --description "Owned by the $z zone (docs/ZONES.md)" || true
done
```

- [ ] **Step 7: Commit** (no npm gate needed — no client code touched):

Commit: `feat(devex): zone ownership plumbing — ZONES.md, CODEOWNERS, zone labels, issue intake`

---

### Task 13: Docs, final verification, required CI check

**Files:**
- Modify: `docs/FileStructure.md` (rewrite to describe `app/ shells + features/ + shared/` with the zone table), `README.md` and `CONTRIBUTING.md` (add a "Zones & ownership" paragraph linking `docs/ZONES.md`)
- No code changes.

- [ ] **Step 1: Rewrite `docs/FileStructure.md`** — document the final tree (Zone → path map from this plan's header), the three platform barrels and what belongs in each, the shared/ui barrel, the shell pattern for `app/`, and the import rules.

- [ ] **Step 2: Update `README.md` + `CONTRIBUTING.md`** — short section: zones exist, docs/ZONES.md is the map, PRs get zone labels automatically, CODEOWNERS routes review.

- [ ] **Step 3: Full verification**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: all PASS (build needs the Supabase env vars from `client/env.example` in `.env.local`; if absent locally, note it and rely on CI's build).

- [ ] **Step 4: Manual smoke** — `npm run dev`, then load `/`, `/auth`, `/apply`, `/events`, `/careers`, `/dashboard` (logged out → expect redirect to `/auth` for dashboard), and one admin route. Confirm no runtime module-not-found errors. Report what was and wasn't smoke-tested.

- [ ] **Step 5: Commit + push branch + PR** — single PR for the whole branch per repo convention.

Commit: `docs: file structure and contributor docs for zone ownership`

- [ ] **Step 6: After the PR merges — make `build` a required check** (GitHub settings, needs admin):

```bash
NWO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
gh api -X PUT "repos/$NWO/branches/main/protection" \
  --input - <<'EOF'
{
  "required_status_checks": { "strict": false, "contexts": ["build"] },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF
```

CODEOWNERS review stays advisory (`required_pull_request_reviews: null`) per the spec.
