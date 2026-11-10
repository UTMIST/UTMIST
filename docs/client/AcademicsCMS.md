# Academics content in Payload

The `academics-pages` collection supplies Foundations to Frontiers at
`/ml-fundamentals`. Its unique `key` is `f2f`. The collection lives in
`client/src/cms/collections/AcademicsPages.ts`; the public contract and validation
live in `shared/lib/content/academics.ts`, exported through `@/shared/lib`.

## Editable content

| Editor tab | Fields |
| --- | --- |
| Page copy | Hero eyebrow, title and continuation, action labels; introduction heading, descriptions, workshop image and alt text |
| Workshops | Heading, description, optional notice; kick-off; ordered topics and ordered sessions |
| Session | Title, Foundations/Frontiers track, description, date display, optional ISO date, time, location, independent slides/recording/code links |
| FAQs | Heading and ordered questions/answers with optional labeled links |
| Team | Heading, optional notice, ordered names/roles, portrait URLs and director badges |

Drag array rows to reorder them. Clear a resource URL to show “coming soon”.
Clear optional notices when content is approved. A FAQ link needs a destination
and label. Links accept HTTPS or site paths starting with `/`; protocol-relative
and executable URLs are rejected.

Date display is editorial text, allowing “Date to be announced”. The optional
machine-readable date must be a real `YYYY-MM-DD` date; update or clear it when
changing the display date.

Images accept local raster assets or public HTTPS Supabase Storage URLs matching
the existing Next Image host configuration. No upload collection is introduced:
ephemeral deployment disk storage is not a persistent upload service. Supply
introduction alt text; portraits are decorative alongside each person's name.
An empty portrait uses the existing placeholder. Images crop within their cards.

Hero layout and colors, navigation, buttons, footer, code illustration, and
archive route remain shared code components. Editors supply content, not layout
classes or executable markup.

## Drafts, publishing and permissions

Only authenticated Payload `cms-users` editors may create, update, delete or
read versions. Supabase membership does not grant CMS permissions. The existing
`CMS-Access` gate still protects all CMS entry points.

This collection uses [Payload versioned drafts](https://payloadcms.com/docs/versions/drafts),
retaining up to 25 versions per document. **Save Draft** keeps the last published
page visible. **Publish changes** validates required content and publishes the
current edit. **Unpublish** removes the public record. Never-published drafts
are unavailable publicly. This differs from the foundation `content-sections`
proof's manual status field, which does not retain a last-published version.

The server-only `payloadAcademicsReader` queries with both `_status: published`
and `draft: false`, sets `overrideAccess: false`, and passes no editor user,
request, or cookie. Dashboard login does not expose drafts on the public page.
Runtime validation strips CMS metadata before components receive content.

## Source selection and local setup

Hosted source acceptance remains [#495](https://github.com/UTMIST/UTMIST/issues/495).
Academics follows the homepage policy: Payload supplies content only in local
`NODE_ENV=development`, without `VERCEL`/`VERCEL_ENV`, when `CMS-Access` is On.
`Web-Redesign` must also be On to render F2F. Build/hosted runs and disabled CMS
access deliberately use static design-preview content. Flag defaults remain
Off. Once CMS is selected, missing, invalid or unavailable content raises an
error instead of silently substituting preview data.

1. Follow [Payload local setup](Payload.md#local-setup) with Node 24, isolated
   Postgres, `PAYLOAD_SECRET` and `PAYLOAD_DATABASE_URI`. Use synthetic content.
2. Enable `CMS-Access` and `Web-Redesign` in local fixtures or authenticated local
   overrides. Keep Vercel/provider context unset when using fixtures, then start
   `npm run dev`. Restore fixture defaults before committing.
3. Create or sign into a local editor at `/cms`. Open **Academics pages** and
   create the **Foundations to Frontiers** record. Complete the required tabs,
   including at least one topic/session, FAQ and team profile, then publish.
4. Open `/ml-fundamentals`. Save an edited heading as a draft; the public heading
   stays unchanged. Publish it, then reload the page to see the change. No
   content PR, rebuild or server restart is needed. Saving does not update an
   already open page automatically.
5. `CMS-Access` also opts the homepage into its existing local example. Create
   the `home-impact` Content Section using the [reader recipe](ContentReader.md#local-edit-proof)
   if testing homepage navigation with CMS enabled.

The loader calls Next's `connection()` before reading and performs a new query
on every request. Generated types come from `npm run payload:generate-types`;
do not edit them by hand. The universal barrel uses explicit `.ts` exports so
Payload's native Node 24 CLI and Next share validators without CMS importing
feature components.

Local schema changes use the existing Payload development schema-push workflow.
Hosted database migration and source configuration belong with isolated
environment acceptance; do not run development schema push against a hosted
database. This integration does not activate Production CMS access.

## Verification

Run lint, typecheck, tests and build from `client/`. Academics tests cover editor
permissions, published reads, validation, source gating, fresh reads, failures
and propagation to existing page components.

In an isolated database, verify dashboard login, Save Draft, Publish changes,
reordering, clearing optional fields, and public refresh. Check anonymous and
invalid-token create/update/delete requests, anonymous draft/version reads, and
invalid-link publication. Unpublish should remove public access; republishing
should restore it. Check longer edited content at desktop, tablet and narrow
mobile widths. Record dated results in the PR, not this recipe.
