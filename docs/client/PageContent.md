# Page content in Payload

The `pages` collection groups each page into one record. `home` contains the
redesigned homepage's sections, including its repeating event cards, sponsors,
statistics, benefits, and FAQ entries. Editors open **Pages → Home** to work
on them together. Payload's native blocks provide structured section forms;
there is no custom page builder or public route generator.

This is the homepage slice of [collection setup #512](https://github.com/UTMIST/UTMIST/issues/512).
The collection map below is proposed for review before merge. The remaining
site inventory, including careers and the events pages, still belongs to #512.
[Transfer #513](https://github.com/UTMIST/UTMIST/issues/513) owns connecting
records to public pages and deciding the final admin navigation and order.

## Content map

The record has `title` (editor label), unique kebab-case `slug`, ordered
`sections`, and `status` (`draft` or `published`). The seed's slug is `home`.
Paths below are relative to `client/src/features/public-site/`. The public-site
zone owns the homepage sources; department editing permissions are not assigned
by this schema.

| Section type | Fields | Existing source |
| --- | --- | --- |
| `hero` | `eyebrow`, `heading`, `description`, `links[] { label, href }` | `pages/home-redesign.tsx`, `data/home-content.ts` |
| `about` | `eyebrow`, `heading`, `description`, `cta { label, href }`, `image`, `imageAlt`, `caption` | Same homepage and copy files |
| `impact` | `heading`, `statistics[] { number, description }` | `data/home-impact.ts` |
| `mission` | `eyebrow`, `heading`, `description`, `cta` | Homepage and copy files |
| `sponsors` | `eyebrow`, `heading`, `description`, `cta`, `items[] { asset, alt, href }` | Homepage and `data/home-sponsors.ts` |
| `events` | `eyebrow`, `heading`, `description`, `communityStatement`, `listHeading`, `items[] { key, title, description, category, href, artwork, imageAlt }` | Homepage, `data/home-events.ts`, `components/home-community-statement.tsx` |
| `startups` | `eyebrow`, `heading`, `description`, `cta`, `benefits[] { title, description }` | Homepage and copy files |
| `faq` | `eyebrow`, `heading`, `items[] { question, answer }` | Homepage and `data/home-faq.ts` |

Sections are embedded in their page record. This slice has no relationships
to other collections. The homepage event cards are promotional content, not
the events calendar or registration records. If a later inventory identifies
shared event or sponsor records, review that relationship before transferring
those pages; avoid maintaining multiple editable copies of the same entity.

The seed is a reviewed snapshot of the current public sources in
`client/src/cms/seeds/home.ts`. Public components continue to use their existing
data. Refresh the seed from those sources if content changes before the first
import. Once a record exists, the seed deliberately preserves it.

## Media and presentation

Media fields select existing repository assets by stable keys. They do not
accept arbitrary file paths, remote images, or uploads:

- `team-eigenai`: `client/src/assets/photos/eigenai-exec-photo.webp`.
- Event keys `eigenai`, `cucai`, `ai2`, and `genai-genesis` select the existing
  artwork definitions in `data/home-events.ts`. Rendering, sizing, and crops
  remain in code.
- Sponsor keys in `client/src/cms/page-assets.ts` correspond to the lowercase
  filename stems of the imports in `data/home-sponsors.ts`. The Modal mosaic
  uses its existing `modal-mark.png` override. Alt text is editable independently
  of the asset identity.

No PDF field or storage adapter is needed for the current homepage. New media
uploads need an explicit storage and access design. CSS, icons, decorative
editor controls, line wrapping, animation, graph coordinates, and logo crop
values stay in components rather than becoming editorial fields. Links accept
site-relative paths, HTTPS URLs, and email links.

## Access and publication

Only authenticated `cms-users` can create, update, or delete pages and read
drafts. Anonymous callers can read published records only. Local API callers
must use `overrideAccess: false` when acting for a visitor; the seed is an
operator-only exception and is not exposed through an application endpoint.
Applicant records and Supabase member authentication are outside this collection.

The status field follows the existing `content-sections` workflow: editing a
published record updates that record directly. It does not maintain a separate
unpublished revision. Set it to Draft before editing content that must be hidden
from anonymous reads. Draft/Published applies to the entire page record.

Creating or publishing a page record does not connect it to the public site.
The existing static homepage and `home-impact` reader remain unchanged, including
their feature flags. The transfer needs a typed page adapter using the shared
reader contract, a safe mapping from asset keys to bundled images, and explicit
missing/error behavior when CMS is selected. Schema setup does not enable
Production CMS access or settle the separate editor-role issue.

## Migrate and seed locally

Use Node 24 and the disposable local database described in [Payload](Payload.md).
The database role must own the `payload` schema. Apply checked-in migrations
before seeding; the seed command disables development schema push.

From `client/`, with the local credentials in an ignored env file:

```bash
NODE_ENV=production node --env-file=.env.payload.local node_modules/payload/bin.js migrate
node --env-file=.env.payload.local src/cms/seeds/run-home.ts
```

If the variables are already exported, use `npm run payload:seed:home`.
The command requires a standalone loopback Postgres URI without query parameters
and refuses Vercel and remote hosts. It creates one draft `home` record, skips
an existing record regardless of status, and reports errors without overwriting
content. It creates no editor accounts. Use the existing authenticated CMS
setup to inspect **Pages → Home** at `/cms`.

The page migration is checked in under `client/src/cms/migrations/` and changes
only the `payload` schema. Hosted migrations and importing the reviewed content
into the shared testing database remain explicit operator steps; no request,
build, or seed command automatically applies them. Follow the hosted migration
procedure in [Payload](Payload.md) after schema review. This local seed command
is intentionally not a production import tool.

## Verification

Run lint, typecheck, and the Jest suite from `client/`. The page tests cover
editor/public access, link validation, seed preservation and failure handling,
and seed target restrictions. Use disposable Postgres to verify the generated
migration, real Payload creation/validation, draft visibility, anonymous write
denial, seed reruns, and migration rollback/reapply before deploying the schema.
