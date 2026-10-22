# Typed CMS content reader

Issue [#346](https://github.com/UTMIST/UTMIST/issues/346) uses the homepage
introduction and statistics as the local editable example. The reader owns
Payload access; feature components receive validated props and import no CMS
runtime. Hosted source selection and preview acceptance remain in #495.

## Collection fields

`content-sections` is registered in `client/payload.config.ts`.

| Field | Contract |
| --- | --- |
| `key` | Required unique lowercase kebab-case identifier, e.g. `home-impact`; independent of visible copy |
| `heading` | Required text; the reader rejects blank/whitespace-only values |
| `description` | Optional supporting text; absent, empty, or null becomes `undefined` |
| `statistics` | Optional ordered array of `{ number, description }`; required and nonempty for the homepage |
| `statistics[].number` | Text containing 1–9 digits, optionally ending in `+` |
| `statistics[].description` | Required nonempty text |
| `status` | Required `draft` (default) or `published` |

Payload also supplies IDs and timestamps; feature schemas strip that metadata.
An omitted/null statistics array becomes `undefined` in the base schema.

## Read and write policy

Only authenticated users from Payload's `cms-users` collection may write.
Supabase membership and a claimed `role: admin` do not grant editor access.
These collection rules apply to REST, GraphQL and Local API callers using
`overrideAccess: false`. Payload's trusted Local API defaults to bypassing
access, so the shared public adapter explicitly disables that bypass and
never passes a request, editor user, or browser cookie.

Editors can read all section records. Public readers can read published
records only. This proof uses a single `status` field, not Payload versioned
drafts: switching a published record to draft removes it from public reads;
there is no retained last-published version. The homepage reader queries only
published content even when the browser is signed into `/cms`.

All CMS endpoints still require the existing `CMS-Access` gate. It controls
availability, while collection rules control permissions. Bootstrap the first
editor only in your isolated local database; subsequent anonymous account
creation is denied by the existing editor collection permissions.

## Reader usage

Universal schemas, types and `createFixtureContentReader` are exported from
`@/shared/lib`. The real adapter is server-only and exported from
`@/shared/lib/server`. For example, inside a server component/feature loader:

```ts
import { payloadContentReader } from "@/shared/lib/server";
import { homeImpactDefinition } from "@/features/public-site/data/home-impact";

const result = await payloadContentReader.read(homeImpactDefinition);
if (result.status === "found") {
  // result.content has the schema's inferred type, including required statistics.
  return result.content;
}
// Decide explicitly how this feature presents a missing or failed read.
```

Every definition has a stable `key` and a Zod runtime `schema`.
`ContentReader.read<T>` returns one of:

- `{ status: "found", content: T }` — validated content only.
- `{ status: "missing" }` — no published record with that identifier.
- `{ status: "error", reason }` — `invalid-key`, `invalid-content`, or
  `unavailable`. Raw documents, database errors, and secrets are never returned.

Invalid identifiers stop before database access. The adapter lazily initializes
Payload and queries its real Postgres adapter on every read. No content is
cached between reads; only Payload's connection pool is reused. Consumers must
also avoid a static route cache: the opted-in local homepage calls Next's
`connection()` before reading, so a reload makes a fresh request. Saving does
not push an update into an already open tab; reload `/` to see the change.

## Source selection and offline example

The homepage selects Payload only when `NODE_ENV=development`, no `VERCEL` or
`VERCEL_ENV` context exists, and `CMS-Access` evaluates On. Local live provider
credentials and signed browser overrides remain supported. No new environment
variable or flag is introduced. With local access Off, and in deployed/build
runs, the homepage deliberately keeps its original static source. This is
explicit source selection until #495, not a failed-read fallback. Once local
CMS mode is selected, missing, invalid, or unavailable content raises an error;
it never substitutes the original content or an offline fixture.

The small offline example reuses the original hard-coded content with the same
typed contract. It requires no database and is never chosen automatically:

```tsx
import { createFixtureContentReader } from "@/shared/lib";
import OrganizationImpact from "@/features/public-site/components/organization-impact";
import { homeImpactContent, homeImpactDefinition } from "@/features/public-site/data/home-impact";

const reader = createFixtureContentReader([
  { key: homeImpactDefinition.key, status: "published", ...homeImpactContent },
]);
const result = await reader.read(homeImpactDefinition);
if (result.status !== "found") throw new Error("Invalid offline example");
return <OrganizationImpact content={result.content} />;
```

## Local edit proof

1. Follow [Payload local setup](Payload.md#local-setup): Node 24, standalone
   Compose Postgres, local `PAYLOAD_SECRET` and `PAYLOAD_DATABASE_URI`. Use only
   development credentials and synthetic content. Keep Vercel deployment
   context variables unset. Enable `CMS-Access` using the documented fixture
   opt-in or a signed local override.
2. Run `npm run dev`. Open `/cms`, create the first local editor if needed,
   then create a **Content Section** with key `home-impact`, a synthetic heading,
   at least one statistic (e.g. number `7+`, description `Synthetic projects`),
   and status **Published**. Optional description can be left empty.
3. Open `/` in a tab with the same local opt-in. The intro and statistics
   display the CMS values. Edit the heading, change the statistic to `12+`,
   add/reorder a row, and save. Reload `/`; the changed values come through the
   real reader without a source edit, content PR, rebuild, or server restart.
4. Sign out of the CMS. Without an editor token, POST to
   `/cms-api/content-sections`, PATCH/DELETE a record's
   `/cms-api/content-sections/<id>`, and try an invalid editor token. With
   `CMS-Access` still On, expect 401/403 and no mutation. If using signed flag
   overrides, include the same override cookie in each direct request; without
   it the gate correctly returns 404 before Payload runs.
5. Mark the record Draft as an editor. Anonymous GET
   `/cms-api/content-sections?where[key][equals]=home-impact` returns no records;
   an editor can still read it. Reloading the local homepage now surfaces
   missing content rather than displaying the draft or fixture. Publish it
   again to restore the local example. With access Off all CMS requests return
   404 and the homepage uses its deliberate original source.
6. Restore any edited flag fixture to false before committing. Stop the
   disposable local database with `npm run payload:db:stop` when finished.

### Local verification on October 22, 2026

Verified on Node 24.21.0 using a separate synthetic database inside the
standalone Compose Postgres service and a signed local `CMS-Access` override.
The existing development database's editor accounts were left untouched.
The real Payload REST API authenticated a synthetic editor, created the
published section (`201`), and saved changed intro/statistics plus an added
row (`200`). Consecutive homepage HTTP requests rendered the new values
without a rebuild or restart. Anonymous and invalid-token POST/PATCH/DELETE
requests all returned `403` with `Cache-Control: no-store`.

After changing the record to draft, anonymous collection reads returned no
records while an authenticated editor read it successfully. The opted-in
homepage reported missing published content (`500`) and did not render the
draft. Republishing restored the section; omitting the local flag override
returned the deliberate original homepage source. These were real HTTP,
Payload adapter, and Postgres checks; browser animation is covered separately
by component tests.

## Proposing feature fields

Start with a feature-owned definition and stable key, extending
`contentSectionSchema` to require the fields that feature needs. A different
section with these fields uses the same reader unchanged. Keep its presentational
component independent of the source. Propose any additional collection fields
with the platform/design-system owners, add runtime validation to the feature
definition, regenerate Payload types, and include access/reader behavior tests
and a recipe update. Feature-specific collections and department permission
rules remain in W2/W3/W4; do not invent a generic schema framework here.

Tests in `content-reader.test.ts`, `content-sections-access.test.ts`,
`home-impact.test.ts`, and the homepage suite cover the contract, access rules,
local opt-in, error handling, refresh reads, and data propagation. Run the three
CI gates and `npm run build` from `client/`.
