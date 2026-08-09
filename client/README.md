# UTMIST Client Application

The UTMIST club website: a Next.js 16 app (App Router, React 19, Tailwind 4)
with authentication and data storage on Supabase.

This document covers **how the app is put together**. For anything else:

| You want to… | Go to |
| --- | --- |
| Get it running locally | [docs/Setup.md](../docs/Setup.md) |
| Open your first PR | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Write or run tests | [docs/client/Testing.md](../docs/client/Testing.md) |
| Find where a file lives | [docs/client/FileStructure.md](../docs/client/FileStructure.md) |
| Read up on a specific page or component | [docs/client/](../docs/client/) |

## Authentication

Email/password auth through Supabase, with sessions carried in server-side
cookies.

### Sign-in flow

1. The user submits credentials on `/auth`.
2. The client calls the Supabase Auth API.
3. On success the session is established and cookies are set via
   `/api/auth/set-cookie`.
4. Middleware refreshes that session on subsequent requests.

Profile data lives in a `user` table keyed by the Supabase auth user id. The
`admin` boolean on that row is what distinguishes an admin from a member.

### Two layers of protection

Both layers matter, and neither is sufficient alone.

**1. Middleware** ([`src/middleware.ts`](src/middleware.ts) →
[`src/utils/supabase/middleware.ts`](src/utils/supabase/middleware.ts))

Runs on every non-asset request. It refreshes the Supabase session and bounces
signed-out users away from anything under `USER_PATHS`:

```
/dashboard   /api   /admin   /applicants
```

Middleware only knows *signed in* versus *signed out*. It cannot tell an admin
from an ordinary member.

**2. Server-side guards** ([`src/lib/auth/guards.ts`](src/lib/auth/guards.ts))

This is where the admin check actually happens.

| Guard | Use in | Behaviour |
| --- | --- | --- |
| `requireUser()` | Server components | Returns the profile, redirects to `/auth` if signed out |
| `requireAdmin()` | Server components | Returns the profile, redirects to `/auth` unless `admin` |
| `getCurrentUser()` | Route handlers | Returns the profile or `null` |
| `getAdminUser()` | Route handlers | Returns the profile, or `null` unless `admin` |

> **Any surface exposing applicant data — names, emails, phone numbers,
> addresses, resumes, essay answers — must sit behind `requireAdmin()` in a
> server component, or `getAdminUser()` in a route handler.** Adding the path to
> `USER_PATHS` is not enough on its own; that only gates signed-out visitors.

A page that calls a guard becomes dynamically rendered rather than statically
prerendered. You can confirm a route is actually gated by looking for `ƒ`
(Dynamic) rather than `○` (Static) next to it in `npm run build` output.

### Error handling

Auth errors are normalized to the `AUTH_ERRORS` codes in
[`src/utils/auth.ts`](src/utils/auth.ts), so the UI can distinguish cases like
"email already taken" from "email needs confirmation" and offer the right
follow-up (such as resending a confirmation mail).

## Server-side logic

There is no separate backend service. Server work lives in App Router route
handlers under [`src/app/api/`](src/app/api/):

| Route | Purpose |
| --- | --- |
| `api/auth/set-cookie` | Establishes the session cookie after sign-in |
| `api/auth/signout` | Clears the session |
| `api/applications` | Applicant records — admin only |
| `api/drive_upload` | Pushes uploaded resumes to Google Drive |
| `api/umami/overview` | Traffic stats for the `/admin` dashboard |

## Deployment

Vercel, driven by [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
Every push to `main` that passes lint, typecheck, test, and build is deployed to
production automatically.

Environment variables are stored as GitHub Actions secrets for CI and in the
Vercel project settings for runtime. When adding a new one, it must be added in
**both** places, plus documented in [`env.example`](env.example).

Supabase redirect URLs need to list the production origin alongside
`http://localhost:3000`, or auth callbacks will fail in production only.
