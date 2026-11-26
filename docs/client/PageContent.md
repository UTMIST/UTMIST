# Homepage content

The redesigned homepage reads one `pages` document with slug `home` through
the shared `readCmsContent` policy. Open **Pages → Home** in `/cms`.

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
Review those values before publishing. Existing Home sections and other page fields are preserved.

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
| Supported By | Intro and CTA. Sponsors are queried from **Sponsorship → Sponsors and partners**. |
| Events | Intro, community statement, list heading, ordered Events relationships and card artwork |
| Startups | Intro, CTA and benefits |
| FAQ | Intro and questions/answers |

The Home document keeps `home` as both its slug and template. It must contain
exactly one of each section before publishing.
Public reads validate the same section set and resolve published records. Section order in the editor
does not change the page layout; presentation stays in code. Drafts may be
incomplete while an editor works. Array entries use Payload’s row identities;
editors do not maintain React keys.

The shared schema is `client/src/shared/lib/content/home-page.ts`. The static
fallback and seed both use `features/public-site/data/home-page.json`, so there
is no separate seed snapshot to refresh. Other pages, including the careers
and events pages, remain under the #513 inventory.

## Media and presentation

In **Sponsorship → Sponsors and partners**, add a website, select an image
from **Website → Media**, check **Show on Home**, and publish. Supported By
lists matching published partners by name. Draft partners and unpublished,
missing, or unsupported logos are omitted. Logos may use the existing bundled
sponsor logos, a public path, or an HTTPS URL. Alt text comes from Media,
with the partner name as the default.

Home chooses which Events records to feature and their order. The linked
published record supplies the title and summary. Cards use the event's
destination URL or its registration URL when the destination is unavailable. Editors choose
the existing EigenAI, CUCAI, AI Squared, or GenAI artwork on the Home placement.
An unavailable event is omitted from the listing. The About photo stays in code
with editable alt text and caption.

Page history records copy and event selections. Partners, logos, and events
keep their own history. A restored page uses the currently published linked
records and sponsor selection.

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

Use Node 24 and a disposable database. The Home sections migration extends
the Pages schema from #521. It also marks the original homepage sponsors on
databases seeded before **Show on Home** was added. If a testing database
already ran the superseded #518 page migrations, export its editorial content
and use a clean #521-based testing database before applying this branch’s
migration. The two migration histories both create `pages`.

With local Payload environment variables exported, run from `client/`:

```bash
NODE_ENV=production npm run payload:migrate
NODE_ENV=production npm run payload:seed
npm run payload:seed:home
```

The general seed loads Partners and shared records. The Home import creates
the page as a draft or adds sections to a pre-existing Home with no sections.
It carries forward published legacy impact content and reuses existing event
records. Review the Home draft and publish it through `/cms`. Re-running the
import preserves existing sections and their draft edits.

The Home command defaults to standalone loopback Postgres. On an approved
testing database with the canonical schema and shared records already in place,
its `--testing` option accepts the scoped CMS login documented in
[Payload](Payload.md#hosted-migrations).

## Verification

Publish Home in a disposable database. Enable both flags locally, edit the
hero and another section, publish, and reload `/`: both changes should appear
without a restart. Check or clear **Show on Home** on a partner and publish.
Verify the listing changes after reload. Edit a linked event and publish to
verify its card updates. Save a newer draft and verify the previously published
copy remains visible, including while signed in as an editor. Publishing
missing/duplicate sections must fail. Anonymous writes, draft reads and
version-history reads must be denied. Turning CMS access Off restores the
static fallback. See the PR for run-specific evidence and screenshots.

`home-page.test.ts` covers source selection, publication query options, fresh
reads, schema failures and structural validation. `cms-pages.test.ts` covers
editor permissions, links and import guards. The homepage rendering tests
exercise edited copy, destinations and media labels.
