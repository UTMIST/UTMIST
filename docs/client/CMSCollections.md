# CMS collections and seed

This is the implementation map for [#512](https://github.com/UTMIST/UTMIST/issues/512).
It records the current public sources, collection slugs, field ownership, and
local seed procedure. Public routes use the listed static sources until their individual cutovers.
[Home](PageContent.md) uses the shared reader when CMS is enabled.

## Source inventory

Only public website content is in scope. The owner column names the editor-facing
area responsible for the record, not a code owner or access-control role.

| Current source | Public page(s) | CMS destination | Owner |
| --- | --- | --- | --- |
| `src/features/public-site/data/home-content.ts`, `home-faq.ts`, `home-impact.ts`, `home-events.ts`, `home-sponsors.ts` and Home components | `/` | `pages` (`home`) plus `events` relationships and a published sponsor query | Website |
| `src/features/public-site/pages/departments.tsx` | `/departments` | `pages` (`departments`) and `people` | Website |
| `src/assets/sponsors.json`, `src/features/public-site/pages/sponsors.tsx` | `/sponsors` | `pages` (`sponsors`) and `partners` | Website |
| `src/assets/projects.json` | `/projects` | `projects`; listing configuration in `pages` (`projects`) | Content |
| `src/assets/posts.json` | `/blog` | `posts`; featured/listing configuration in `pages` (`blog`) | Content |
| `src/features/public-site/pages/startups.tsx` | `/startups` | `startups`, `partners`, and `pages` (`startups`) | Content |
| `src/assets/careers.json`, `src/features/careers/pages/careers.tsx` | `/careers` | `careers`; listing configuration in `pages` (`careers`) | Content |
| `src/features/events/api/events.ts`, `src/features/events/pages/events.tsx` | `/events` | `events`; listing configuration in `pages` (`events`) | Content |
| `src/features/public-site/data/ai2.tsx`, `src/features/public-site/pages/ai2.tsx` | `/ai2` | `pages` (`ai2`), `people`, `partners`, and related `events` | Website |
| `src/features/public-site/data/eigenai-redesign.ts`, `src/assets/photos/eigenai-2026/**` | `/eigenai` | `pages` (`eigenai`), `events`, `people`, `partners`, and `media` | Website |
| `src/features/public-site/data/ml-fundamentals.ts`, `src/features/public-site/pages/ml-fundamentals.tsx` | `/ml-fundamentals` | `pages` (`ml-fundamentals`), `people`, and linked resources on the page/event | Website |
| `src/shared/ui/navbar.tsx`, `footer.tsx` | Site-wide layout | `site-settings` global | Website |
| Public images and linked documents used by the sources above | Multiple | `media` | Assets |
| `src/assets/applicants.json` and application/admin routes | Recruitment only | **Out of scope**; remains in the applicant system | Recruitment |
| `proofs` and the transitional `content-sections` collection | CMS foundation/Home reader proof | Existing transitional collections; no new public surface | Infrastructure |

`eigenai-speakers.json` is not imported by a current page and is therefore not
seeded. Wishlist papers, podcasts, hosted article bodies, and individual
startup/article routes are not current surfaces and do not get collections.

## Collection map

Every public collection uses Payload drafts and versions. Anonymous reads are
restricted to published records; authenticated `cms-users` can read drafts and
write. See the [admin groups](Payload.md) and [access issue #514](https://github.com/UTMIST/UTMIST/issues/514).

| Slug | Stable identity | Fields and relationships |
| --- | --- | --- |
| `pages` | `slug`, one record per fixed `template` | Title, introduction, FAQ, SEO metadata, sponsorship packages, and ordered selections of events, projects, posts, careers, startups, partners, and people |
| `events` | `slug` | Kind, summary, machine dates or a legacy display date, venue, registration and card destination links, instructor, tags, learning goals, resources, schedule; speaker role and sponsor tier stay on the relationship |
| `projects` | `slug` | Name, description, category, image, repository URL, destination URL |
| `posts` | external URL and `slug` | External article title, author byline, publication date, image; no hosted body |
| `partners` | `slug` | Organization name, website, logo, **Show on Home**; tiers and placement stay on page/event relationships |
| `people` | `slug` | Public name, bio, photo, profile URL; team/event roles stay on relationships |
| `careers` | `slug` | Title, department, division, description, application URL, open/close dates; no applicant fields |
| `startups` | `slug` | Name, description, logo, website; no individual route |
| `media` | unique `source` | Title, image/document kind, repository path or HTTPS URL, image alt text |
| `site-settings` | one global | Contact email, navigation, social links, footer text |

The older `proofs` and `content-sections` slugs remain registered so existing
foundation data remains available for review. They are hidden from editor navigation.

## Media and document rules

- `media.source` accepts an existing `src/assets/...` path, public `/...` path,
  or HTTPS URL. It does not copy a file or make repository assets publicly
  addressable by itself.
- File upload is intentionally disabled until durable storage, delivery,
  replacement, and deletion behavior are agreed. Vercel's local filesystem is
  not a media store.
- Images carry reusable default alt text in `media`; a contextual caption or
  different alt text belongs with the page/event placement that needs it.
- Current external PDFs, slides, videos, notebooks, and articles remain HTTPS
  resources. Do not upload or mirror them during this setup step.
- Applicant resumes and private documents never enter `media`.

## Local seed

Start the disposable local database and configure `PAYLOAD_DATABASE_URI` and
`PAYLOAD_SECRET` as described in [Payload setup](Payload.md#local-setup). Apply
the checked-in migrations, then run:

```bash
npm run payload:migrate
npm run payload:seed
```

If `payload:migrate` warns that the database was previously schema-pushed in
development and that data loss may occur, decline the prompt. Preserve any
local editor/content records and verify the migrations in a new disposable
database whose `payload` schema has already been created, or take an explicit
backup before reconciling that database.

The seed imports the public JSON/TypeScript data listed in
`src/cms/seed-data.ts`. It creates published records only when their stable key
is absent. Re-running it reports existing records and never overwrites editor
changes. It does not delete records and never reads `applicants.json`.

The seed currently transfers the structured collection sources, page
introductions, Home FAQ/impact content, startup/partner/person identities, the
four Events page featured cards and their ordered page relationship, and site
settings. Page-specific long-form sections remain in code and stay the public
source of truth until the content-transfer work connects and verifies each
template.

When testing against shared Development or Preview, use synthetic records and
do not run the seed unless the environment owner has explicitly approved that
content load. Never use schema push or a fresh/reset command against hosted
Postgres.
