# Project File Structure

## Root Directory

- **`/client/`**
  The Next.js application. This is the entire codebase — the site is a single
  full-stack Next.js app, with server-side logic living in route handlers
  under `client/src/app/api/` rather than a separate backend service.

- **`/docs/`**
  Project documentation, including this file and [`docs/ZONES.md`](ZONES.md),
  the ownership map.

- **`/.github/`**
  CI/CD pipeline setup for GitHub Actions, CODEOWNERS, issue templates, and
  the zone/size PR labelers.

## `client/src/` — zone layout

The client is organized into ownership **zones**: `app/` shells, `features/`,
and `shared/`. See [`docs/ZONES.md`](ZONES.md) for who owns what and why —
this file is about where code physically lives; ZONES.md is about who is
responsible for it. The two must agree.

```
client/src/
├── app/                  # routes: thin shells + a few cross-cutting files
│   ├── layout.tsx        # root layout (design system)
│   ├── globals.css       # design tokens (design system)
│   ├── not-found.tsx     # 404 page (design system)
│   ├── dev/              # component playground (design system)
│   ├── page.tsx          # re-exports features/public-site/pages/home
│   ├── departments/ projects/ sponsors/ blog/ startups/
│   │   ai2/ eigenai/ ml-fundamentals/ api/umami/    # → public-site
│   ├── apply/ applicants/ admin/
│   │   api/applications/ api/apply/ api/drive_upload/  # → recruitment
│   ├── careers/                                        # → careers
│   ├── events/                                          # → events
│   └── auth/ profile/ dashboard/ api/auth/              # → members
├── features/
│   ├── public-site/      # pages/ components/ api/ data/ hooks/ types/
│   ├── recruitment/      # pages/ components/ api/ types/
│   ├── careers/          # pages/
│   ├── events/           # pages/ components/ api/
│   └── members/          # pages/ components/ api/
├── shared/
│   ├── ui/                # design-system barrel (components + index.ts)
│   └── lib/                # platform: auth/ hooks/ storage/ supabase/
│       ├── index.ts        # universal barrel   → @/shared/lib
│       ├── client.ts        # browser-only barrel → @/shared/lib/client
│       ├── server.ts        # server-only barrel  → @/shared/lib/server
│       └── storage.ts       # server-only storage barrel → @/shared/lib/storage
├── assets/                # images, icons, static JSON (careers.json, etc.)
├── styles/
└── middleware.ts          # platform
```

## The `app/` shell pattern

Every route under `client/src/app/` (besides the design-system files listed
above) is a **thin shell**: it re-exports the real page component from its
owning feature and nothing else.

```ts
// client/src/app/events/page.tsx
export { default } from "@/features/events/pages/events";
```

Route logic, data fetching, and UI all live in
`features/<zone>/pages/<name>.tsx` — the file under `app/` exists only
because Next.js's file-system router requires something at that path. This
keeps ownership of a route's behavior with the feature zone even though the
router forces a physical file under `app/`. Route handlers under
`app/api/**` are the exception — they hold real logic and are attributed to
a zone by path (see the Recruitment/Members path lists in
[`docs/ZONES.md`](ZONES.md)), not re-exported as shells.

## The four platform barrels

`shared/lib` has four entry points instead of one, so a browser bundle can
never accidentally pick up server-only code (`next/headers`, `googleapis`,
etc.), and routes that never touch Google Drive don't bundle `googleapis`.
Every import into `shared/lib` from outside it goes through one of
these four — never a deep path into `shared/lib/auth/*`,
`shared/lib/supabase/*`, or `shared/lib/storage/*`.

| Barrel | Import path | Safe in | Contains |
| --- | --- | --- | --- |
| Universal | `@/shared/lib` | client & server | Auth types, validation helpers, `cn()` |
| Client-only | `@/shared/lib/client` | client components | Browser Supabase client, client-side auth helpers, `useUser()`, upload helpers |
| Server-only | `@/shared/lib/server` | server components, route handlers | Server Supabase client, `updateSession()`, auth guards (`requireUser`, `requireAdmin`, …) |
| Storage (server-only) | `@/shared/lib/storage` | route handlers that upload to Drive | Google Drive upload + validation helpers (pulls in `googleapis` — import only where actually needed) |

## The `shared/ui` barrels

The design system has two entry points, split the same way as `shared/lib`:

- `@/shared/ui` — server-safe primitives: `button`, `input`, `textarea`,
  `footer`, `heroSection`. Safe to import from server components; pulls in
  no Supabase or client-only dependencies.
- `@/shared/ui/client` — client chrome: `navbar`, `select`, `dropdown`,
  `theme-provider`, `theme-toggle`, `floating-theme-toggle`, `scrollToTop`.
  These are `"use client"` components (navbar reaches Supabase via
  `@/shared/lib/client`).

Import components from these barrels, not from `shared/ui/<file>` directly.

## Import rules

- `features/*` may import from `shared/*`, never from another feature.
- `shared/*` never imports from `features/*`.
- Everyone outside `shared/lib` itself goes through the barrels —
  `@/shared/ui`, `@/shared/ui/client`, `@/shared/lib`, `@/shared/lib/client`,
  `@/shared/lib/server`, `@/shared/lib/storage` — not deep imports into
  shared internals.
- `app/**` (other than `app/api/**`) may only import the shared barrels —
  route shells re-export from `features/*`, they don't reach into feature
  internals or shared internals directly.
- These rules are enforced by ESLint (`client/eslint.config.mjs`);
  violations fail CI.

## Client-level docs

- [`client/README.md`](../client/README.md) — architecture: auth flow,
  server-side guards, deployment.
- [`docs/client/Testing.md`](client/Testing.md) — test suite conventions.
- [`docs/client/`](client/) — per-page and per-component notes.

## Additional Notes

- Follow the naming conventions and folder structure to maintain consistency.
- Add documentation for any new directories or files you create.
- New feature work should land under `features/<zone>/`, not directly under
  `app/`. If a change doesn't fit an existing zone, raise it — see
  [`docs/ZONES.md`](ZONES.md).

For further questions, refer to the `README.md` or contact the project maintainers.
