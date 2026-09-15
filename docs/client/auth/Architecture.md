# Authentication & middleware

Owned by the Platform zone (see [ZONES.md](../../ZONES.md#platform)). Covers
everything under `client/src/shared/lib/auth/`, `client/src/shared/lib/supabase/`,
and `client/src/middleware.ts`, plus the sign-in/session pages under
`client/src/app/auth/` (`features/members/pages/`).

There is no separate backend. Auth is Supabase (email/password, cookie-backed
sessions), and every server-side check runs inside this Next.js app — either
in `middleware.ts` or in a route handler / server component.

## The two layers

**Neither layer alone is sufficient.**

1. **Middleware** — [`client/src/middleware.ts`](../../../client/src/middleware.ts)
   → [`shared/lib/supabase/middleware.ts`](../../../client/src/shared/lib/supabase/middleware.ts).
   Runs on every request except static assets (see the `matcher` in
   `middleware.ts`). It refreshes the Supabase session via
   `supabase.auth.getUser()` and redirects to `/auth` if the request has no
   user **and** the path starts with one of:

   ```
   USER_PATHS = ["/dashboard", "/api", "/admin", "/applicants"]
   ```

   Middleware only knows signed-in vs. signed-out. It cannot tell an admin
   from an ordinary member — the file says so in its own comment.

2. **Server-side guards** — [`shared/lib/auth/guards.ts`](../../../client/src/shared/lib/auth/guards.ts),
   exposed through the `@/shared/lib/server` barrel:

   | Guard | Return | Use in | Behavior |
   | --- | --- | --- | --- |
   | `requireUser()` | `UserProfile` | Server components | Redirects to `/auth` if signed out |
   | `requireAdmin()` | `UserProfile` | Server components | Redirects to `/auth` unless `admin` |
   | `getCurrentUser()` | `UserProfile \| null` | Route handlers | Returns the profile or `null` |
   | `getAdminUser()` | `UserProfile \| null` | Route handlers | Returns the profile, or `null` unless `admin` |

   All four share one internal `loadProfile()`: get the auth user, then
   `select * from public.user where id = <auth user id>`. The `admin` boolean
   on that row is the only thing distinguishing an admin from a member.

## Adopted per-surface protection standard

> Any surface exposing applicant data (names, emails, phone numbers,
> addresses, resumes, essay answers) must sit behind `requireAdmin()` in a
> server component, or `getAdminUser()` in a route handler. Adding the path
> to `USER_PATHS` is not enough on its own.
> — [AGENTS.md](../../../AGENTS.md#access-control), restated in
> `client/README.md` and as a code comment in `guards.ts` and
> `supabase/middleware.ts`.

This is the standard the audit in [`Audit.md`](Audit.md) checks the codebase
against. As implemented today:

| Surface | Kind | Guard used |
| --- | --- | --- |
| `/admin` | server component | `requireAdmin()` |
| `/applicants` | server component | `requireAdmin()` |
| `/applicants/[profile]` | server component | `requireAdmin()` |
| `GET /api/applications` | route handler | `getAdminUser()` (403 if absent) |
| `POST /api/apply` | route handler | none — public intake, writes the submitter's own data only |
| `POST /api/drive_upload` | route handler | bare `supabase.auth.getUser()`, not the shared guard — see [`Audit.md`](Audit.md) |

A page or route calling a guard becomes dynamically rendered. `npm run build`
output shows `ƒ` (Dynamic) rather than `○` (Static) next to a gated route —
that's the quick way to confirm a surface is actually gated.

## Flows

### Sign-in

1. User submits the form on `/auth` →
   [`features/members/pages/auth.tsx`](../../../client/src/features/members/pages/auth.tsx).
2. `login(email, password)` in
   [`shared/lib/auth/client.ts`](../../../client/src/shared/lib/auth/client.ts)
   calls `supabase.auth.signInWithPassword` (browser client).
3. On success, `login()` POSTs the resulting session to
   `POST /api/auth/set-cookie` →
   [`features/members/api/set-cookie.ts`](../../../client/src/features/members/api/set-cookie.ts),
   which calls `supabase.auth.setSession(session)` server-side so the session
   cookie exists on the next request.
4. Middleware refreshes that session on every subsequent request.

### Session refresh

Entirely `shared/lib/supabase/middleware.ts`'s `updateSession()` — see "The
two layers" above. Every request re-derives the user from cookies via
`supabase.auth.getUser()`; there is no separate refresh endpoint.

### Sign-out

Client-side `logout()` in `auth/client.ts` does **both**: POSTs to
`POST /api/auth/signout` (→ `features/members/api/signout.ts`, which calls
server-side `supabase.auth.signOut()` to clear cookies) **and** calls
`supabase.auth.signOut()` on the browser client directly. Both calls target
the same Supabase session; the route exists so the httpOnly cookie is cleared
server-side.

### Password reset

1. `resetPassword(email)` (`auth/client.ts`) calls
   `supabase.auth.resetPasswordForEmail(email, { redirectTo: '<origin>/auth/callback?type=recovery' })`.
   Triggered from the inline "Forgot password" panel inside
   `features/members/pages/auth.tsx` (there is no separate forgot-password
   page).
2. The email link lands on `GET /auth/callback` (see Callback below), which
   detects `type=recovery` and redirects to `/auth/reset-password`.
3. [`features/members/pages/reset-password.tsx`](../../../client/src/features/members/pages/reset-password.tsx)
   checks `supabase.auth.getUser()` (browser client) on mount — if there is
   no session, it redirects to `/auth?error=reset_expired`. On submit it
   calls `supabase.auth.updateUser({ password })` directly and redirects to
   `/dashboard`.

   This page's own-session check is a client-side `useEffect`, not
   `requireUser()`/middleware — see [`Audit.md`](Audit.md) for why that's
   worth flagging even though no PII is at stake here.

### Callback (email confirmation + OAuth + recovery)

`GET /auth/callback` →
[`features/members/api/auth-callback.ts`](../../../client/src/features/members/api/auth-callback.ts).
Exchanges the `?code` for a session (`exchangeCodeForSession`), then:

- `type=recovery` (or a `recovery` query param) → redirect to `/auth/reset-password`.
- otherwise → redirect to `?next` (default `/profile`).
- no code, or exchange fails → redirect to `/auth?error=no_code` or
  `/auth?error=confirmation_failed`.

Used by `resetPassword`, `register` (`emailRedirectTo`), `resendConfirmation`,
and `signInWithGoogle` — all set `AUTH_CONFIG.CALLBACK_PATH = '/auth/callback'`
in `auth/client.ts`.

## Client-side auth API (`shared/lib/auth/client.ts`)

Exposed through `@/shared/lib/client`: `login`, `register`, `logout`,
`resetPassword`, `resendConfirmation`, `signInWithGoogle`, `updateProfile`,
`onAuthStateChange`, `getCurrentUser` (browser variant — see
[`Audit.md`](Audit.md) for the name collision with the server-side
`getCurrentUser` in `guards.ts`), and the `AUTH_ERRORS` constant used to
normalize a subset of Supabase error messages for the UI.

## Barrels

`shared/lib` has four entry points so browser bundles never pick up
server-only code. Auth-relevant exports:

| Barrel | Import path | Exposes |
| --- | --- | --- |
| Universal | `@/shared/lib` | `AuthErrorCode`, `UserProfile`, `AuthUser` types |
| Client-only | `@/shared/lib/client` | Everything in `auth/client.ts` and `auth/user.ts`, `useUser()` |
| Server-only | `@/shared/lib/server` | `createClient`, `updateSession`, all of `auth/guards.ts` |

Full rules: [`docs/FileStructure.md`](../../FileStructure.md#the-four-platform-barrels).
