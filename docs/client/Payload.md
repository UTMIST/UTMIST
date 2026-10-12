# Payload CMS

Payload 3 is embedded in the existing Next.js application. It provides a
local content dashboard and API, but no public UTMIST page reads from it yet.
That separation is intentional for the foundation work in issue #345.

This implementation records the choices requested by
[the integration decision task (#344)](https://github.com/UTMIST/UTMIST/issues/344):
Payload is embedded in `client/`, deploys with the existing Vercel app, uses a
dedicated Postgres schema and editor user collection, and proves the runtime
through the `proofs` collection without selecting a public render surface yet.

## Routes

| Route | Purpose |
| --- | --- |
| `/cms` | Payload editor dashboard |
| `/cms-api` | Payload REST API |
| `/cms-api/cms-graphql` | Payload GraphQL endpoint |
| `/cms-graphql-playground` | Payload GraphQL playground |

The existing recruitment dashboard remains at `/admin`. Payload uses its own
`cms-users` authentication collection and does not reuse Supabase member
sessions.

## Availability flag (#443)

All routes above, including login, first-user setup, collection/auth APIs,
GraphQL queries and mutations, and the playground, require the server-side
[`CMS-Access` flag](https://vercel.com/utmist-infrastructure/client/flag/CMS-Access).
The owner is UTMIST Infrastructure (`utmist-infrastructure/client`); Angela
Zheng owns the #443 rollout work. Its SDK key is exactly `CMS-Access`, its
description is “Access to the UTMIST CMS controls”, and its boolean variants
are `false` (Off) and `true` (On). The code default is **Off in every environment**.
Offline fixtures default Off and support an explicit local opt-in.

This uses the existing [shared flag architecture](flags.md), rather than a
Payload-specific provider. `requireCmsAccess` and `withCmsAccess` are exported
through `@/shared/lib/server`. The layout, page, metadata, not-found render,
and server-function callback check before invoking Payload. Middleware checks
CMS page POSTs before Next.js dispatches any action, including Payload's built-in
`switchLanguageServerAction`, which does not call our guarded callback. Disabled
POSTs return an uncached JSON 404 even with an existing editor cookie or without
a `Next-Action` header. REST methods
(`GET`, `HEAD`, `POST`, `DELETE`, `PATCH`, `PUT`, `OPTIONS`), GraphQL
(`POST`, `OPTIONS`), and playground (`GET`, `HEAD`) use the same evaluator.
Off returns the [default UTMIST 404 page](NotFound.md) for CMS and playground page requests
and a JSON 404 for API requests, without calling the Payload runtime or database.
An editor's existing session cannot bypass a disabled flag.

Middleware rewrites disabled CMS page GET/HEAD requests to the frontend's
`/cms-unavailable` not-found page, preserving the browser URL. The CMS root
layout and not-found boundary keep their own gates and never import frontend
layouts or components. This keeps the enabled dashboard's native Payload CSS
isolated from frontend global rules. Supabase session refresh and signed
local/Preview flag overrides are preserved by the rewrite.

The route group and API handlers are force-dynamic; API responses set
`Cache-Control: no-store` on both branches. Each subsequent request/action
evaluates the flag again. Only SDK client construction is shared across
requests. Live stream updates affect later evaluations without rebuilding;
propagation depends on the provider connection, rather than a guaranteed
application timeout. Missing definitions/configuration, errors, non-boolean
values, and stale cached definitions deny access. Keep the existing
`VERCEL_FLAGS_DISABLE_DEFINITION_EMBEDDING=1` build setting so embedded
definitions cannot become a fallback.

When enabled, Payload's editor authentication and collection permissions still
apply. `Proofs.access.read` currently permits anonymous reads, including drafts.
The availability flag does not restrict those reads to Angela or other editors.
Keep Production Off while the foundation is unfinished. Enable Development or
Preview only for intended testing with synthetic data. No verified per-person
targeting is implemented; the evaluator uses anonymous server context and does
not accept identity claims from request bodies or cookies.

### Dashboard configuration verified on October 10, 2026

The existing flag has no targeting rules or environment reuse. Development and
Preview are paused with both paused outcome and fallthrough set to **On**;
Production is paused with both outcomes **Off**. “Paused” alone does not mean
Off: the provider serves the configured paused outcome. These dashboard values
were inspected, not changed by this implementation. They override the code's
fallback default while provider evaluation is healthy. Review them before
deploying; use Off outside deliberate CMS testing.

Vercel deployments use request-time OIDC with the existing core adapter; no
manual `FLAGS` key or new environment variable is required. `FLAGS_SECRET`
authenticates Explorer discovery/overrides, not provider access. Development
and Preview accept authenticated browser overrides as an explicit testing
opt-in, consistent with the other flags. Production ignores browser overrides
and follows its provider value.

### Isolated preview verification

Use an approved isolated CMS database with synthetic proof records and an
isolated flag environment before changing dashboard values. The shared Preview
flag value applies to every Preview using that environment. Clear Explorer
overrides, keep the deployment unchanged, and:

1. Set the effective value Off (including paused outcome if paused). Request
   `/cms`, `/cms/login`, `/cms/create-first-user`, every REST method, GraphQL
   queries/mutations and OPTIONS, and playground GET/HEAD. Expect 404, no CMS
   content, and no Payload/database calls in the runtime logs.
2. Set On; record the time until subsequent requests render the editor login.
   Authenticate a synthetic editor and read/write a synthetic proof. Confirm an
   unauthenticated write still fails through Payload's collection permissions.
3. Leave that editor open and set Off. Record propagation time; repeat direct
   API requests with the same session and submit an action from the open editor.
   Also try switching the editor's language to exercise Payload's built-in action.
   Expect unavailable responses and no successful action. Confirm API responses
   remain `no-store`, and compare the deployment ID to prove no redeploy occurred.
4. Check `/`, `/eigenai`, and Supabase sign-in/profile flows throughout.

Local automated tests exercise the gate transitions and real SDK fallback
behavior without credentials. A live isolated Preview timing measurement is
still required; automated tests do not establish provider propagation latency.

For #443, local verification on Node 24.21.0 passed lint, typecheck, the full
test suite and the production build using the locked Linux dependencies. HTTP
checks against that build used a deliberately unreachable synthetic database:
all CMS pages and supported API methods returned 404, including requests with a
synthetic editor cookie; API responses were `no-store`. Public pages rendered
and the existing Supabase-protected paths still redirected signed-out visitors
to `/auth`. This verifies the disabled runtime without a CMS database, while
enabled delegation and collection permissions are covered by automated tests.

Run `npm run test:cms-actions` manually after `npm run build`. It invokes the
real compiled Payload language action with the same synthetic editor cookie
across Off → On → Off: Off must return `404`/`no-store` without setting
`payload-lng`, and On must actually set `payload-lng=fr`. This supplements the
Jest layout mocks so an unguarded built-in action cannot be hidden by them.
The test uses signed local overrides and an unreachable synthetic database;
it does not verify live Vercel propagation or require Development keys.

## Database isolation

For issue #345, `PAYLOAD_DATABASE_URI` points to a standalone local Postgres
database. It does not point to Supabase. The adapter is additionally fixed to
the dedicated `payload` schema, so all CMS tables and development migrations
remain isolated from the application's Supabase `public` schema.

Development mode uses Payload's schema push workflow. Treat this local
database as disposable and never substitute a production database URI.
Connecting Payload to a hosted database, running hosted migrations, and adding
hosted proof data are deliberately deferred to the isolated-environment
verification task.

## Local setup

### Prerequisites

Install and start Docker Desktop. When developing inside WSL, enable Docker
Desktop's WSL integration for the Ubuntu distribution. Node 24 and the other
application prerequisites remain documented in [Setup](../Setup.md).

### Start Postgres

From `client/`, start the database and wait for its health check:

```bash
npm run payload:db:start
```

This starts PostgreSQL 17 on `127.0.0.1:5432` with a persistent Docker volume.
The database, user, and password in `compose.payload.yml` are intentionally
fixed development-only values. They must never be reused for a hosted
environment.

To stop Postgres without deleting its data:

```bash
npm run payload:db:stop
```

### Configure environment variables

Add these server-only values to `client/.env`:

```env
PAYLOAD_SECRET="replace-with-a-random-secret"
PAYLOAD_DATABASE_URI="postgresql://payload:payload_local_dev@127.0.0.1:5432/utmist_payload"
```

Generate `PAYLOAD_SECRET` locally instead of copying the example value:

```bash
openssl rand -base64 32
```

Paste that command's output between the quotes. Payload uses it to sign its
authentication tokens. It is unrelated to the local Postgres password and to
all Supabase keys. Keep it private, do not commit `client/.env`, and use a
different value in every future hosted environment.

`PAYLOAD_DATABASE_URI` can be copied exactly for this local Compose service.
It contains only development credentials. Do not replace it with
`NEXT_PUBLIC_SUPABASE_URL` or a Supabase API key.

### Start Payload

With Postgres healthy and the environment variables saved, start the normal
application with `npm run dev`. CMS access starts Off without provider credentials.
For local testing without Vercel access, set the `CMS-Access` entry in
[`fixtures.ts`](../../client/src/shared/lib/flags/fixtures.ts) to
`{ enabled: true }` and restart the dev server. Keep provider credentials and
Vercel context unset as described in [local flag setup](flags.md#local-flags-without-vercel-access).
Restore the fixture to `false` before committing; deployed environments keep
using their live provider rather than these local values.

For live local evaluation, follow [the flag setup](flags.md#set-up-this-project): link
`client/` to `utmist-infrastructure/client`, pull Development OIDC and the
existing `FLAGS_SECRET`, then enable the Development value for testing or use
the local Toolbar on a frontend page to override `CMS-Access` to On. Clear the
override when finished. A valid signed override can opt in locally even without
provider credentials; an arbitrary cookie cannot.

Once enabled, open `http://localhost:3000/cms`. On an
empty database, Payload creates its schema and prompts you to create the first
editor. The dashboard then exposes the `CMS proofs` collection with required
`title`, `message`, and `status` fields.

No seed is required: proof records are synthetic and can be created directly
in the dashboard. Do not connect this collection to public content pages until
the shared content contract and isolated preview tasks are ready.

## Generated files and commands

Payload owns `src/payload-types.ts` and
`src/app/(payload)/cms/importMap.js`; do not edit them by hand. `npm run build`
refreshes both before the Next.js production build. They can also be refreshed
independently:

```bash
npm run payload:generate-types
npm run payload:generate-importmap
```

The local Compose credentials are only for issue #345. A future hosted proof
must configure both Payload variables in the applicable GitHub Actions and
Vercel environments, use a different secret, and target an approved isolated
database or database branch.
