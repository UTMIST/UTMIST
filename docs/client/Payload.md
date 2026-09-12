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
| `/cms-graphql` | Reserved Payload GraphQL endpoint |
| `/cms-graphql-playground` | Reserved Payload GraphQL playground |

The existing recruitment dashboard remains at `/admin`. Payload uses its own
`cms-users` authentication collection and does not reuse Supabase member
sessions.

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
application with `npm run dev`, then open `http://localhost:3000/cms`. On an
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
