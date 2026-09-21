# Auth/session audit — findings

Part of [F4: Platform audit](https://github.com/UTMIST/UTMIST/issues/272).
Audit scope only, per that epic: this records what exists, what is verified,
and what needs a focused fix. It does not fix anything and does not approve
anything for production. See [`Architecture.md`](Architecture.md) for the
system this audit checked against.

**Audited:** 2026-09-14. **Auditor:** Michelle Liu (Platform zone owner).

## 1. Per-surface protection standard — compliance

Checked every page/route reachable under `client/src/app/admin/`,
`client/src/app/applicants/`, and the API routes in
`client/src/app/api/applications/`, `api/apply/`, `api/drive_upload/`,
against the AGENTS.md rule (any surface exposing applicant PII sits behind
`requireAdmin()`/`getAdminUser()`).

| Surface | Guard | Status |
| --- | --- | --- |
| `/admin` (`features/recruitment/pages/admin.tsx:6`) | `requireAdmin()` | OK |
| `/applicants` (`features/recruitment/pages/applicants.tsx:6`) | `requireAdmin()` | OK |
| `/applicants/[profile]` (`features/recruitment/pages/applicant-profile.tsx:6`) | `requireAdmin()` | OK |
| `GET /api/applications` (`features/recruitment/api/applications.ts:9`) | `getAdminUser()`, 403 if absent | OK |
| `POST /api/apply` | none | OK |
| `POST /api/drive_upload` (`features/recruitment/api/drive-upload.ts:100-109`) | bare `supabase.auth.getUser()` | **Inconsistent** — see Finding 1 |

No surface was found that returns applicant PII without a guard. The rule
is respected everywhere it needs to be; the one inconsistency below is about
implementation consistency, not a live PII leak.

## 2. Test evidence

| File | Covers |
| --- | --- |
| `tests/unit/auth-guards.test.ts` | `getAdminUser`, `getCurrentUser`, `requireAdmin`, `requireUser` in isolation — signed-out, non-admin, DB error, happy path |
| `tests/integration/auth.test.ts` | Supabase call shapes for sign-in/sign-up/reset/sign-out against a hand-rolled mock client (not the app's own `shared/lib` code) |
| `tests/unit/pages/auth.test.tsx` | `/auth` page: login/register mode switch, validation, successful login + redirect, forgot-password panel, already-authenticated redirect |
| `tests/unit/pages/reset-password.test.tsx` | `/auth/reset-password`: redirect when unauthenticated, form render, validation errors, successful update |
| `tests/unit/pages/admin.test.tsx` | `requireAdmin()` redirect behavior (no user / non-admin / DB error) **for the `/admin` page specifically**, plus render for admins |
| `tests/unit/pages/dashboard.test.tsx` | Client-side auth gate, sign-out flow, redirect to `/auth` |
| `tests/unit/pages/profile.test.tsx` | Client-side auth gate, profile render, admin card |
| `tests/unit/api/applications.test.ts` | `getAdminUser()` 403 paths, no-leak-on-403 check, filtered results for admins |
| `tests/unit/pages/applicants.test.tsx`, `applicants-profile.test.tsx` | Client component behavior (`ApplicantsPageClient`, `ApplicantProfileClient`) — **not** the page-level `requireAdmin()` redirect |

## 3. Test gaps

| Surface | Untested behavior | Current coverage |
| --- | --- | --- |
| `client/src/middleware.ts` / `shared/lib/supabase/middleware.ts` | `USER_PATHS` gating, session-refresh call | None — no test exercises either file directly; coverage today is indirect, through pages that separately call a guard |
| `GET /auth/callback` (`features/members/api/auth-callback.ts`) | Code exchange, `type=recovery` branch, `no_code` and `confirmation_failed` error redirects | None |
| `POST /api/auth/set-cookie` | Cookie set on `SIGNED_IN` event | None |
| `POST /api/auth/signout` | Server-side `signOut()` clearing cookies | None |
| `/applicants` (`applicants.tsx`) | `requireAdmin()` redirect (signed-out / non-admin) | None at the page level — `applicants.test.tsx` covers only the client component, assuming the guard already passed |
| `/applicants/[profile]` (`applicant-profile.tsx`) | `requireAdmin()` redirect (signed-out / non-admin) | None at the page level — `applicants-profile.test.tsx` covers only the client component, assuming the guard already passed |

## 4. Other inconsistencies found

These are documentation/consistency findings, not access-control failures.

| # | Finding | Location | Details |
| --- | --- | --- | --- |
| 1 | `drive_upload` doesn't use the shared guard helpers | `features/recruitment/api/drive-upload.ts:100-109` | Inlines `supabase.auth.getUser()` instead of calling `getCurrentUser()` from `@/shared/lib/server`. Functionally equivalent today (self-service upload of the caller's own resume, keyed to their own `user.id`), but it's a second, separate auth-check pattern next to the one `guards.ts` exists to centralize. |
| 2 | `requireUser()` has no production callers | `auth/guards.ts:46` | The only references are in its own test. `/dashboard` and `/profile` are exactly the "signed-in but not necessarily admin" case this guard is for — but those pages are `'use client'` components, and can't call a `next/headers`-dependent server guard from `@/shared/lib/server`. They reimplement the same check client-side instead (see #3), so this is an unmigrated pattern rather than simple dead code. `USER_PATHS` already gates `/dashboard` at the edge on the initial request, but the client-side check also covers a session that expires mid-visit, which middleware wouldn't catch until the next navigation — so it isn't purely redundant either. |
| 3 | Two unrelated functions are both named `getCurrentUser` | `auth/client.ts:25` (browser, returns `AuthUser`) vs. `auth/guards.ts:35` (server, returns the `public.user` row) | Reachable from different barrels (`@/shared/lib/client` vs. `@/shared/lib/server`) so there's no import collision, but the shared name makes it easy to grab the wrong one when only skimming an import list. The server-side `getCurrentUser` has no production callers for the same reason as `requireUser` (#2): `/dashboard` and `/profile` are client components that call the browser-side `getCurrentUser` instead. |
| 4 | `AUTH_ERRORS` and `AuthErrorCode` have drifted apart | `auth/client.ts` vs. `auth/types.ts` | `AUTH_ERRORS` declares `INVALID_CREDENTIALS`, `SESSION_FAILED`, `NETWORK_ERROR` — none of which `handleAuthError()` ever assigns; `login()` throws the raw Supabase message instead. Only `EMAIL_ALREADY_TAKEN` and `EMAIL_NEEDS_CONFIRMATION` are ever thrown, and those are the only two cases `auth.tsx` switches on. Separately, `AuthErrorCode` adds `WEAK_PASSWORD` and `UNKNOWN_ERROR`, which aren't in `AUTH_ERRORS` at all. The two lists should be one source of truth. |
| 5 | `signInWithGoogle()` is unreferenced by any UI | `auth/client.ts:268` | No sign-in button calls it. Either finish wiring Google OAuth or remove the dead path. |
| 6 | `/auth/reset-password` doesn't use the guard pattern | `features/members/pages/reset-password.tsx` | The only session-gated screen that checks auth with an ad hoc `useEffect` calling the browser Supabase client directly, rather than relying on `USER_PATHS`/middleware or a `shared/lib/server` guard. It doesn't expose PII, so this isn't a compliance gap against the AGENTS.md rule, but it's a third auth-checking pattern in a codebase that otherwise has two. |

## 5. Fixes to file

Per the F4 working convention, each of these should be filed as its own
focused issue under the F/W epic that owns the affected code, not fixed
inside this audit. Recommended targets:

| # | Finding | Suggested epic | Why |
| --- | --- | --- | --- |
| 1 | `drive_upload` bypasses shared guards | W1: Recruitment | Recruitment owns `api/drive_upload` |
| 2 | Dead `requireUser()` | F4/F5 (Platform) | Lives in `shared/lib`, cross-cutting |
| 3 | Duplicate `getCurrentUser` naming | F4/F5 (Platform) | Same |
| 4 | `AUTH_ERRORS`/`AuthErrorCode` drift | F4/F5 (Platform) | Same |
| 5 | Orphaned `signInWithGoogle` | F4/F5 (Platform) or W1 | Decide product intent first (finish vs. remove) — coordination, not a straight fix |
| 6 | `reset-password` ad hoc auth check | F4/F5 (Platform) | `shared/lib`-pattern consistency |
| — | Middleware/callback/set-cookie/signout test gaps | F4/F5 (Platform) | Test infrastructure for Platform-owned code |

None of these issues have been filed yet — this table is the input for that
step, not a record of it. Only the resulting fix issues' integration/release
tasks should depend on them, per the F4 working convention; this audit issue
itself is not blocked by any of them.
