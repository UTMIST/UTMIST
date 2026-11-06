# Environment and database audit

Evidence collected on November 5–6, 2026 (UTC), for
[#293](https://github.com/UTMIST/UTMIST/issues/293). Repository baseline:
`74ef976` on `main`. This is an inventory of the observed configuration, not
approval of environment isolation or a production rollout.

**Vercel Development, Preview, and Production use the same Supabase application
project. The newly configured hosted CMS also shares a database, schema, and
login between Preview and Production.** The disposable local Payload database
is separate. Remediation and proof that non-production credentials cannot
access production data remain in
[#374](https://github.com/UTMIST/UTMIST/issues/374).

## Verified resources

| Resource | Observed identity |
| --- | --- |
| Supabase organization | UTMIST, `hhkncxdrwfbzkzneoldv` |
| Website project | [UTMIST Website](https://supabase.com/dashboard/project/gqqgsvhzonratwkmjiji), `gqqgsvhzonratwkmjiji`, `us-east-2`, `ACTIVE_HEALTHY` |
| Website database | `postgres`, PostgreSQL 15.8; direct host `db.gqqgsvhzonratwkmjiji.supabase.co` |
| Website preview branches | `supabase branches list --project-ref gqqgsvhzonratwkmjiji --output json` returned `[]` |
| Other project visible in the UTMIST organization | `Startups-Mobile-App`, `tigjjysindffwfmnwfdq`, `INACTIVE`; no inspected website configuration points to it |
| Vercel project | `utmist-infrastructure/client`, `prj_L6wyTsPfqVyJGmheCUenmIutXtJz` |
| Vercel team | UTMIST Infrastructure, `team_xAGWQZLeFUyvgLA8iOTNJFnu` |
| GitHub repository | `UTMIST/UTMIST` |

The authenticated Supabase CLI was version `2.117.0`. Queries used an explicit
project ref; no login, password reset, provisioning, or billing change was
needed. The project inventory is limited to resources visible to that account.

## Environment mapping

| Environment / execution path | Supabase application target and credential source | Payload target and credential source |
| --- | --- | --- |
| Local development using the repository template | `client/env.example` has placeholders for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; a contributor supplies them through an ignored env file or process environment. No separate hosted development target is established by the template. | Compose Postgres at `127.0.0.1:5432/utmist_payload`, role `payload`, schema `payload`. Development-only credentials are in `client/compose.payload.yml`; `PAYLOAD_SECRET` is supplied locally. |
| Vercel Development settings, including a Development env pull | `gqqgsvhzonratwkmjiji.supabase.co`; project-level `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, each shared across all three Vercel targets. | No Development `PAYLOAD_DATABASE_URI` or `PAYLOAD_SECRET` entry was returned. Contributors must configure their local CMS database separately. |
| Vercel Preview | The same website project and shared application entries as Production. | `postgres` through `aws-0-us-east-2.pooler.supabase.com:5432`, pooled username `utmist_payload.gqqgsvhzonratwkmjiji`, schema `payload`. Preview-scoped `PAYLOAD_DATABASE_URI` and `PAYLOAD_SECRET` were provisioned for #506/#507. The URI is shared with Production; the signing secret is distinct. |
| Vercel Production settings | The same website project and shared application entries. | The same hosted CMS target, using Production-scoped Payload entries. These settings were added after the current production deployment; their presence does not demonstrate that deployment has consumed them. |
| GitHub CI `build` job | Reads `secrets.NEXT_PUBLIC_SUPABASE_URL` and `secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY`. Repository entries exist, but their values cannot be read back through the secrets API. Unavailable secrets fall back to `https://placeholder.supabase.co` and a placeholder key. | Reads the repository Payload secrets provisioned with the hosted CMS credentials. Unavailable secrets fall back to a loopback placeholder URI and a CI-only signing secret. The current build does not run hosted migrations. |
| GitHub CI `preview` job | Sends source to the pinned Vercel project; Vercel builds with its Preview settings. | Uses the same Vercel Preview settings. The workflow supplies no Payload database override on the deployment command. |
| GitHub CI `deploy` job | On pushes to `main`, pulls Vercel Production configuration, explicitly supplies the repository Supabase secrets to `vercel build --prod`, and deploys the prebuilt output. | Explicitly supplies the repository Payload secrets to the production build. Their configured provenance is the #506/#507 provisioning operation. |

The source for the CI paths is
[`.github/workflows/ci.yml`](../../.github/workflows/ci.yml). The Preview job
accepts same-repository PRs and excludes Dependabot. Fork/Dependabot builds
can use placeholders; this fallback does not make trusted PR builds isolated
when real repository secrets are available. Tests configure their own mock
Supabase environment in `client/jest.setup.js`.

### Vercel evidence and limits

The [project environment listing](https://vercel.com/utmist-infrastructure/client/settings/environment-variables)
returned one `NEXT_PUBLIC_SUPABASE_URL` entry assigned to Development, Preview,
and Production. Reading that public URL confirmed the project ref above.
The anonymous key and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` each also have one
entry shared across those three targets. The application currently reads the
anonymous-key variable; the publishable-key name is not used by the inspected
Supabase clients.

There were no branch overrides or custom environments in the returned
configuration, and zero hidden Production entries. The relevant entries had
no integration `configurationId`. A separate inventory of all team-level
shared variables was not available from the inspected project responses.
The checked-in CI commands have no database `--env`/`--build-env` override.
Unrecorded manual deployment overrides remain unverified.

The four hosted Payload entries are Secret variables. Their target scopes,
creation timestamps, and absence of subsequent updates were checked. The
database-URI equality and distinct signing secrets are supported by the
November 5 provisioning record in
[#506](https://github.com/UTMIST/UTMIST/issues/506) and
[#507](https://github.com/UTMIST/UTMIST/pull/507), rather than an independent
read-back of hidden secret values. This audit does not publish those values.

### Current deployments

The current Production deployment was
`dpl_54Rxytv5TFC4PgqanjPpMYzS5iUX`, built from `74ef976` on October 27, 2026,
with `www.utmist.ca` among its aliases. A read of the public `/auth` page and
its client assets independently found the website project's Supabase hostname
and the matching project ref in the browser's anonymous-key claims. No key
value is recorded here. This verifies the deployed browser's application
target, not every server-side runtime variable.

The CMS connection Preview from #507 is
[`client-4zv49v6k7-utmist-infrastructure.vercel.app`](https://client-4zv49v6k7-utmist-infrastructure.vercel.app),
deployment `dpl_ExsFYHZwGq5zVtwqT7PDDnYidaHP`. CI and Preview deployment passed.
Vercel records the CI checkout's merge SHA (`aefac512...`) and branch `HEAD`;
the PR head is `30c8f42`. Do not infer a branch-specific environment override
from the PR's source branch name. #507 remained an unmerged draft at audit time.

Vercel project protection reports `enabled: true` and
`deploymentType: all_except_custom_domains`. That is access protection for
deployments, not database isolation. This audit did not repeat #302's complete
authenticated/unauthenticated URL walkthrough or #495's hosted editor proof.

## Local and CLI configuration

The inspected `New-Home-Page`, `CMS-Supabase`, and `Environment-Audit` workspaces
had no standard `client/.env`, `.env.local`, `.env.development*`, or
`.env.production*` files. The audit shell had no Supabase application variables,
Payload variables, database password/PG host overrides, or exported
`SUPABASE_ACCESS_TOKEN`. No `.vercel/project.json` override was found in those
workspaces. This does not describe other contributors' machines or shells.

The `CMS-Supabase` workspace retains an ignored, owner-readable
`client/.env.payload-hosted.local` for explicit verification. Its URI points
to the hosted pooler and scoped role listed above. That custom filename is not
automatically loaded by Next.js; previous checks loaded it explicitly. A
connection using this file and #507's TLS configuration returned
`current_user = utmist_payload`, `current_database() = postgres`, and access
to the `payload` schema. Only connection and privilege metadata were queried.

The same workspace contains a CLI cache naming the website project, but no
standard `.temp/project-ref` file was present and the CLI's project listing
reported it as unlinked. Explicit `--project-ref` is therefore the evidence
for the audited target. The CLI's saved authentication successfully listed
projects/branches and ran metadata queries; its token storage was not read.

## Access and isolation findings

1. **Application environments share a production service.** Development and
   Preview credentials target the same Supabase project, including its Auth
   service and application data APIs, as the production browser. RLS and user
   permissions still control individual operations. This finding does not
   assert that an anonymous visitor can read every table; no applicant rows,
   real user records, or resumes were queried.
2. **Hosted CMS environments share CMS data.** The configured Preview and
   Production URI identifies the same database, schema, and role. Separate
   signing secrets distinguish CMS sessions; they do not separate records or
   editor accounts. The explicit decision to reuse the existing database is
   recorded in #506 and does not satisfy #374's current acceptance criteria.
3. **The CMS role is scoped away from application tables.** Supabase catalog
   queries found zero `SELECT`/`INSERT`/`UPDATE`/`DELETE` privileges for
   `utmist_payload` on existing tables/views in `public`, `auth`, or `storage`.
   It can use and create objects in `payload`, and cannot create objects in
   `public`. This is separation between CMS and application tables, not between
   Preview and Production CMS data; it is not a full routine/grant/RLS audit
   under #296. The initial `20261105_212538_initial_payload` migration is applied.
4. **No isolated website branch is configured.** The website's branch listing
   is empty, and none of the inspected website mappings points to the other
   visible UTMIST project. This does not establish that no other resource could
   be reused after its owner approves it.

No infrastructure, credentials, permissions, or application records were
changed to collect this audit evidence.

## Ownership and unverified settings

Ownership below identifies the existing resource administrators and the
repository's documented review responsibilities; it does not assign new work
to an individual. See [zone ownership](../ZONES.md) and
[onboarding/access coordination](../ONBOARDING.md).

| Surface / remaining evidence | Evidence owner | Status and next evidence needed |
| --- | --- | --- |
| Supabase project, roles, branches, database credential rotation | UTMIST Supabase organization/project administrators; Platform review via @michelle-yl | Resource identities and CMS privilege metadata verified. Complete role membership, RLS, and function privileges belong to #296. |
| Vercel project env targets, shared variables, deployment overrides | UTMIST Infrastructure team/project administrators; DevEx review via @Guneevp | Project mapping verified. An administrator must confirm any team-level shared entries or manual deployment overrides outside the inspected responses/workflow. |
| GitHub repository secret values | Repository administrators | Seven secret names were listed, including both Supabase names, both Payload names, and `VERCEL_TOKEN`. Secret values are not readable through the API. Confirm the current CI Supabase value provenance through the owning secret store or a controlled job that emits only target identity; the deployed production browser independently confirms the historical build target. |
| GitHub organization secrets and variables | UTMIST organization administrators; access coordination via @qiuethan | Both list requests returned HTTP 403 due to missing organization-level permission. Confirm which organization entries, if any, are available to this repository. No extra permissions were requested during the audit. |
| GitHub environment settings | Repository administrators | `Preview` and `Production` exist; both have zero environment secrets and zero variables. The inspected CI jobs do not select a GitHub `environment:`. Repository variables are also empty. |
| Other local checkouts, shells, and personal overrides | Each contributor; shared credential distribution coordinated by web team leads | Not inspected. Before synthetic testing, confirm the effective target locally without printing passwords, keys, or full connection strings. |
| Per-deployment server variables and protected Preview behavior | Vercel project administrators / deployment maintainers | Current project settings and deployment identities verified; complete runtime secret snapshots and the hosted CMS acceptance walkthrough are not independently verified here. |

## Follow-up and audit completion

This inventory records all four #293 outcomes: environment targets and
credential sources, access ownership, the shared-data gap, and explicitly
unverified settings with evidence owners. #293 can close when this evidence is
reviewed and accepted, while its remediation remains open.

- [#374](https://github.com/UTMIST/UTMIST/issues/374) owns the smallest approved
  fix and synthetic evidence that Development/Preview credentials cannot
  read or write production data, including CI's credential mapping. The audit
  does not authorize new resources or spending, or remove that requirement.
- [#296](https://github.com/UTMIST/UTMIST/issues/296) owns the broader roles,
  grants, RLS, and identity audit. Its results also feed department editor
  permissions in #340.
- [#506 / #507](https://github.com/UTMIST/UTMIST/pull/507) track the existing
  database connection independently of the homepage redesign. Connection
  success is not evidence that #374 is complete.
- [#495](https://github.com/UTMIST/UTMIST/issues/495) retains the protected hosted
  CMS edit/read/access/flag walkthrough after its prerequisites are satisfied.

## Refreshing the evidence

Use the existing authenticated tools; do not copy credential values into an
issue, PR, terminal transcript, or this document. Scope project-list output to
UTMIST when recording it.

```bash
supabase projects list --output json
supabase branches list --project-ref gqqgsvhzonratwkmjiji --output json
supabase db query --project-ref gqqgsvhzonratwkmjiji --linked --output json \
  "SELECT current_database(), current_user, current_setting('server_version');"
gh secret list --repo UTMIST/UTMIST
gh api repos/UTMIST/UTMIST/environments
gh api repos/UTMIST/UTMIST/environments/Preview/secrets --jq '.secrets[].name'
gh api repos/UTMIST/UTMIST/environments/Production/secrets --jq '.secrets[].name'
```

Recheck the Vercel project environment **metadata**, public Supabase URL,
custom environments, and current deployment IDs. Compare the workflow and
local configuration against the environment table. Read secret values only
when necessary inside a controlled process; record only target identity,
presence, scope, or an equality result. Use catalog metadata and synthetic
checks rather than production application rows. Update the observation date
and any evidence gaps when a configuration changes.
