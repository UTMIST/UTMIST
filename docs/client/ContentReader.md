# Typed CMS content reader

The shared reader owns published Payload access and source selection. Feature
loaders provide a typed definition and a static fallback. Components receive
validated content and import no Payload runtime.

## Shared policy

`readCmsContent` from `@/shared/lib/server` selects CMS only in standalone
local development or Vercel Preview, with `CMS-Access` On. Production, Vercel
Development, tests and standalone production always use the supplied static
fallback. Eligible requests call `connection()` before evaluating the flag,
so published edits and flag changes are observed after a reload without a
rebuild. Flag Off never opens a Payload connection.

Once selected, missing, invalid or unavailable CMS content raises an explicit
error. There is no automatic fixture fallback. Provider failures fail the
availability flag closed. Feature loaders must not duplicate this policy.

```ts
import { readCmsContent, payloadPageReader } from "@/shared/lib/server";
import { homePageContent, homePageDefinition } from "@/features/public-site/data/home-page";

return readCmsContent({
  definition: homePageDefinition,
  fallback: homePageContent,
  reader: payloadPageReader,
});
```

The optional reader selects the collection adapter, not a new environment or
flag policy. Omit it for `content-sections`. Use `payloadPageReader` for Pages.
Both return the same `ContentReader` result contract and initialize Payload
lazily. Only the Payload connection pool is reused; content is queried anew.

## Collections and access

| Adapter | Identifier | Published filter |
| --- | --- | --- |
| Default section reader | `content-sections.key` | `status: published` |
| `payloadPageReader` | `pages.slug` | `_status: published`, `draft: false` |

Both use `overrideAccess: false`, depth zero, and no request, user or editor
cookie. Editor sessions cannot influence public page reads. The separate
`CMS-Access` endpoint gate protects REST, GraphQL and editor actions; the
collection access rules continue to enforce permissions when that gate is On.

Pages has native versions/drafts. Saving a draft retains the last published
page. Section records retain their original single-status workflow; changing
a section to Draft removes it from public reads. Their schema supports heading,
optional description, and optional statistics. Feature schemas can require
additional fields. The homepage now uses Pages; `home-impact` section records
are retained for review and no longer consumed by either homepage layout.

## Validation contract

A `ContentDefinition<T>` has a stable lowercase kebab-case `key` and a Zod
schema. `ContentReader.read` returns:

- `found` with validated content, stripped of unused database metadata;
- `missing` when no published document matches;
- `error` with `invalid-key`, `invalid-content`, or `unavailable`.

Invalid identifiers stop before database access. Errors never reveal raw
records, database messages or credentials. Schemas validate structured content
before it reaches presentation components. The homepage schema additionally
requires exactly one of every required section and restricts links and assets.

`createFixtureContentReader` remains available from `@/shared/lib` for explicit
offline examples and tests. It is never selected automatically by runtime code.

## End-to-end verification

Follow [the homepage edit proof](PageContent.md#verification) locally, then on
one protected Preview backed by the [testing target](Environments.md). Apply
reviewed migrations explicitly and import Home as a draft. Review and publish
it using a testing CMS editor. With `CMS-Access` and `Web-Redesign` enabled for
the test browser, publish edits and reload the same deployment. Save a newer
draft and confirm that both anonymous and signed-in website visits still show
the last published copy. Check denied anonymous mutations and version reads.
Disable the browser override afterwards; do not change Production flags.

Record deployment SHA, tested actions and results in the PR or issue. Do not
commit tokens, credentials, dated logs, or screenshot binaries. Tests cover
the shared policy, both collection adapters, schema errors, and propagation
through the homepage components.
