# Homepage content

The redesigned homepage reads one `pages` document with slug `home` through
Angela’s shared `readCmsContent` policy. Open **Pages → Home** in `/cms`.

## Source selection

| Environment | CMS-Access Off | CMS-Access On |
| --- | --- | --- |
| Standalone local development | Static homepage | Published Home page |
| Protected Vercel Preview | Static homepage | Published Home page |
| Production, Vercel Development, tests, standalone production | Static homepage | Static homepage |

`Web-Redesign` still selects the page layout. The redesigned layout consumes
all eight page sections. The legacy layout consumes the same page’s impact
section; its remaining sections retain their existing static sources.
`content-sections/home-impact` is no longer a homepage source. Existing records
are retained. When creating Home, the import carries forward the published
impact heading, description and statistics before saving the page as a draft.
Review those values before publishing. Existing Home records are never overwritten.

Missing, invalid, or unavailable CMS content raises an explicit error when
CMS is selected. It never silently substitutes static content. Eligible
requests are dynamic, so published edits appear after a reload without a
rebuild or redeploy. Production stays static under the shared policy.

## Collection and field map

| Section | Editable content |
| --- | --- |
| Hero | Eyebrow, heading, description, links |
| About | Eyebrow, heading, description, CTA, photo alt text and caption |
| Impact | Heading, optional description and ordered statistics |
| Mission | Eyebrow, heading, description and CTA |
| Sponsors | Intro, CTA and ordered logo assets, alt text and links |
| Events | Intro, community statement, list heading and event cards |
| Startups | Intro, CTA and benefits |
| FAQ | Intro and questions/answers |

The `home` document must contain exactly one of each section before publishing.
The same runtime schema validates public reads. Section order in the editor
does not change the page layout; presentation stays in code. Drafts may be
incomplete while an editor works. Array entries use Payload’s row identities;
editors do not maintain React keys.

The shared schema is `client/src/shared/lib/content/home-page.ts`. The static
fallback and seed both use `features/public-site/data/home-page.json`, so there
is no separate seed snapshot to refresh. Other pages, including the careers
and events pages, remain under the remaining #512/#513 inventory.

## Media and presentation

Media selects bundled repository assets using stable identifiers. Sponsor
crops and overrides use asset keys, so changing alt text cannot alter the crop.
Event artwork keys select the existing EigenAI, CUCAI, AI Squared and GenAI
assets. The About photo remains fixed in code; its alt text and caption are
editable. Unknown assets and unsafe links fail validation.

Copy remains plain text. Heading and community-copy line breaks are supported;
existing emphasis treatments stay in React. No arbitrary HTML, file paths,
remote images, new uploads, or PDF storage is introduced. Colors, effects,
icons, crops and layout remain presentation concerns.

## Publication and permissions

Pages uses Payload’s native drafts and versions. **Save Draft** retains the
last published page; **Publish** replaces it. **Unpublish** removes it from
public reads, so a CMS-enabled homepage then shows the explicit missing-content
failure. Review the page before publishing; editor login does not make the
public website display drafts.

Only authenticated `cms-users` can write pages, read drafts, or read version
history. Anonymous reads filter `_status: published`. The public adapter uses
`draft: false`, `overrideAccess: false`, and no user, request, or editor cookie.
The `CMS-Access` gate additionally protects the editor, REST, GraphQL and
server actions. Supabase membership is not CMS editor authorization.

## Initial content and migrations

Use Node 24. Apply checked-in migrations before importing, following
[Payload’s migration procedure](Payload.md#hosted-migrations). The page-drafts
migration preserves the old status value by renaming its column. It adds
version tables and removes unused fields. The previous page migration remains
in history so an existing local page database can be upgraded.

For a disposable local database, from `client/`:

```bash
NODE_ENV=production node --env-file=.env.payload.local node_modules/payload/bin.js migrate
NODE_ENV=production node --env-file=.env.payload.local src/cms/seeds/run-home.ts
```

With exported variables, `npm run payload:seed:home` does the same import.
It creates Home as a draft, never overwrites an existing Home record, and
creates no editor accounts. Review and publish it through `/cms`.

The default command accepts only standalone loopback Postgres. An explicit
operator import into the shared testing database uses:

```bash
NODE_ENV=production node --env-file=.env.payload-testing.local src/cms/seeds/run-home.ts --testing
```

`--testing` accepts only the scoped `utmist_payload.lrbvknlviodxhhuautfi`
login on the documented session pooler. Production, unscoped admin logins,
host overrides and deployed invocations are rejected. Secrets stay in ignored
environment files. The command never migrates or publishes automatically.
Hosted changes must use testing first; Production is a separate rollout.

## Verification

Publish Home in a disposable database. Enable both flags locally, edit the
hero and another section, publish, and reload `/`: both changes should appear
without a restart. Save a newer draft and verify the previously published
copy remains visible, including while signed in as an editor. Publishing
missing/duplicate sections must fail. Anonymous writes, draft reads and
version-history reads must be denied. Turning CMS access Off restores the
static fallback. See the PR for run-specific evidence and screenshots.

`home-page.test.ts` covers source selection, publication query options, fresh
reads, schema failures and structural validation. `cms-pages.test.ts` covers
editor permissions, links and import guards. The homepage rendering tests
exercise edited copy, destinations and media labels.
