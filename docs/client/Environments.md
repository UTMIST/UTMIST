# Production and testing environments

The website has two hosted Supabase environments. `testing` is a persistent
branch under the existing **UTMIST Website** project, with an independent
database, Auth service, Storage service, API URL, and credentials.

| Consumer | Supabase target | Payload schema / login |
| --- | --- | --- |
| Vercel Production | `gqqgsvhzonratwkmjiji` (`main`) | `payload` / `utmist_payload` in Production |
| Vercel Preview | `lrbvknlviodxhhuautfi` (`testing`) | `payload` / `utmist_payload` in testing |
| Vercel Development | `lrbvknlviodxhhuautfi` (`testing`) | Same testing records and login as Preview |
| GitHub CI build | GitHub **Preview** environment → testing | Testing credentials, or the complete placeholder set when secrets are unavailable |
| GitHub production deploy | GitHub **Production** environment → production | Production credentials; environment restricted to the `main` branch |

Preview and Development intentionally share test records. They are isolated
from Production, not from each other. Disposable local Compose remains an
option for schema experimentation. This document covers Supabase and Payload;
external integrations such as Google Drive have their own credential setup.

## Credential setup

Configure these existing application variables separately for each target:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `PAYLOAD_DATABASE_URI`
- `PAYLOAD_SECRET`

Vercel also has `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; keep its target aligned
even though the application currently reads the legacy anonymous key.
Production and testing have different CMS passwords and signing secrets.
Neither environment uses Supabase's `postgres` administrator as its CMS login.

Vercel Production/Preview Payload values are Secrets. Development values are
encrypted, readable configuration so authorized contributors can pull them.
Never put a CMS password, signing secret, or service-role key in a browser
variable. Do not copy Production credentials into a local env file.

From `client/`, link the correct Vercel project and pull Development settings
into a new ignored file (back up any existing `.env.local` first):

```bash
vercel link --yes --project client --scope utmist-infrastructure
vercel env pull .env.local --environment=development --scope utmist-infrastructure
```

Check for conflicting shell variables or `.env.development.local` overrides.
The effective Supabase hostname must be `lrbvknlviodxhhuautfi.supabase.co`.
The testing CMS session pooler is `aws-0-us-east-2.pooler.supabase.com:5432`,
database `postgres`, pooled username `utmist_payload.lrbvknlviodxhhuautfi`.
Hosted Payload requires the TLS and migration implementation from
[#507](https://github.com/UTMIST/UTMIST/pull/507); use Compose until that code
is available in your checkout. See [Payload](Payload.md).

## Schema and synthetic content

The branch was created with `with_data: false`. Its six application tables,
functions, grants, RLS policies, and profile-creation trigger were initialized
from schema definitions only. Its three Storage buckets and nine policies
were recreated without copying files. Payload's initial migration
`20261105_212538_initial_payload` created the CMS tables under its scoped role.

Supabase's initial schema replay referenced `utmist_payload` before that custom
role existed. After provisioning the role and applying the schema explicitly,
the application/Payload schema was compared with Production and the matching
Supabase baseline `20261106002045` was recorded as applied in testing. For a
future branch, provision a separate CMS password and role before retrying a
schema replay that references it. Never copy Production's role password, and
never mark a migration applied without verifying that its schema is present.

Use synthetic accounts and records in testing. Production users, resumes,
editor accounts, and content are not test fixtures. For a test login, a
testing-project administrator can use Auth → Users → Add user, choose a fake
test identity, and confirm it explicitly. Sign in using email/password.
The profile trigger creates its application profile. No production Auth user
or session is reused. OAuth provider/SMTP secrets are not copied by branching;
configure testing providers separately if a feature needs them.

For CMS content, an authorized testing administrator bootstraps an editor and
uses the existing proof/content collections. The hosted editor/access/flag
walkthrough remains in [#495](https://github.com/UTMIST/UTMIST/issues/495).
Keep Production CMS access Off during that foundation work.

Apply reviewed schema changes explicitly to testing before Production. Do not
use schema resets or automatic development schema push on the shared branch.
When cleaning a test, remove only its own records. Empty shared tables are not
a safe cleanup strategy when other developers use the same environment.

Testing Auth redirects allow localhost/127.0.0.1 on port 3000 and
`https://*-utmist-infrastructure.vercel.app/**`. Its default site URL is
`http://localhost:3000`; preview flows should supply their own callback URL.

## CI guard and rollout

[`verify-database-target.mjs`](../../scripts/verify-database-target.mjs) checks
the API URL/key project claim, scoped CMS role, pooler, database, URI options,
and presence of a signing secret before each GitHub build. A CI build cannot use
Production values; a production deploy cannot use testing or placeholders.
The key-claim check does not verify a JWT signature or replace live access
tests. Guard tests run as a required step in the existing `build` job.

The environment secrets are provisioned before the workflow switches to them.
Finish the rollout in this order:

1. Merge the CI environment/guard change and verify the required build and
   production deploy select **Preview** and **Production**, respectively.
2. Remove the four legacy repository-level Supabase/Payload secrets listed
   above after confirming the scoped secrets work. Retain unrelated secrets
   such as `VERCEL_TOKEN` and the Maps key. Older workflow revisions still
   rely on the legacy entries until this transition is complete.
3. Refresh active previews so they consume the new Vercel settings. Older
   deployments retain their build/runtime configuration; changing project
   settings does not rewrite them. Retire historical previews with Production
   credentials or invalidate their former credentials as part of #374.
4. Verify a synthetic edit in testing, production rejection of testing API
   keys/session tokens, and production rejection of the testing CMS password.
   Record the tested deployment IDs and finish #374 only after the transition
   and historical-access cleanup are complete.

The November 6, 2026 setup verified testing API reads, a synthetic Auth login
and profile, and CMS create/read/update/delete with rollback. Production
rejected testing API reads/writes and sessions with HTTP 401, and the testing
CMS password with PostgreSQL `28P01`. Synthetic auth/profile records were
removed. No Production application records were queried or changed.

The maintainer approved persistent Micro compute for this branch. It is billed
hourly while running, including when idle; see [Supabase branch pricing](https://supabase.com/docs/guides/platform/manage-your-usage/branching).
Evidence and remaining work belong to [#374](https://github.com/UTMIST/UTMIST/issues/374).
