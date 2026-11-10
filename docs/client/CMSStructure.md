# CMS content structure

The CMS organizes public site content around one record per page, with fixed
editing sections and shared collections for reusable content. Editors manage
copy, images, links, and the order of lists within approved layouts. Developers
maintain the layouts, components, and presentation rules.

This is the agreed target for the site content migration. Collections,
migrations, and public readers are delivered in separate implementation PRs.
See [Payload setup](Payload.md) and [the content reader](ContentReader.md) for
the existing runtime and source-selection behavior.

## Where content belongs

Use the content's ownership and reuse to choose its home:

| Content | Store it in | Examples |
| --- | --- | --- |
| Copy used by one page | That page's record | Hero, section introductions, CTAs, FAQs, page metadata |
| Records managed independently or used in several places | A shared collection | Events, sponsors, projects, people |
| Content shared across the website | Site settings | Contact details, social links, navigation and footer content |

A page owns which records it features and their display order. The referenced
records own their facts. Home's Events section, for example, stores its heading
and an ordered selection of events; each event owns its title, dates, venue,
and registration link. Publishing a change to the event updates every place
that references it, without copying the same fields into each page.

Keep context-specific information on the relationship. A sponsor's tier may
differ between events, and a person's role may differ between programs. Store
the organization or person once, then keep the tier or role alongside the
reference in the relevant page or event. Sponsorship packages advertised on
the Sponsors page remain page content, separate from actual sponsor placements.

## Collections and editor navigation

Use the following grouping and order for the editor navigation. Collection
slugs are stable identifiers for the public readers; labels describe the
content in language editors recognize.

| Group | Editor label | Collection or global | Content it owns |
| --- | --- | --- | --- |
| Website | Pages | `pages` | Page-specific copy, metadata, fixed sections, and featured-record selections |
| Website | Site settings | `site-settings` global | Shared contact, social, navigation, and footer content |
| Content | Events | `events` | Dates, venue, description, registration links, speakers, schedule, and recap resources |
| Content | Projects | `projects` | Name, description, category, image, repository, and destination links |
| Content | Posts | `posts` | Article listing title, author, date, image, summary, and external article URL |
| Content | Sponsors and Partners | `partners` | Organization name, logo, and website |
| Content | People | `people` | Public name, photo, bio, and profile links |
| Content | Careers | `careers` | Internal openings, department, description, application link, and opening/closing information |
| Content | Startups | `startups` | Startup profiles and cohort information |
| Assets | Media | `media` | Shared images and documents with descriptive metadata |
| Administration | CMS users | `cms-users` | Editor accounts and the access configuration agreed by the team |

Pages contains Home, Departments, Sponsors, Projects, Blog, Startups, Careers,
Events, and the program pages. A listing page holds its introduction and
selection rules; its entries come from the corresponding collection.

Site settings is a single record, which fits a [Payload global](https://payloadcms.com/docs/configuration/globals).
Navigation content covers labels, destinations, and ordering; authentication
behavior and route protection remain application logic.

## Fixed page editing

Each page has a stable identifier and an approved template. Developers control
the route mapping and template assignment. Editors work within that template's
named groups or tabs, rather than choosing arbitrary layout blocks.

For Home, the editing form is:

```text
Pages → Home
  Hero
  About
  Impact
  Mission
  Sponsors
  Events and Community
  Startups
  FAQ
  Search and sharing metadata
```

Each required section appears exactly once. Editors can add and reorder FAQ
entries, benefits, or featured records within a section. The template fixes
section order and prevents duplicate or missing required sections at publish
time. Drafts may be incomplete while an editor works. Colors, typography,
spacing, animations, and component selection stay in code.

Use [Payload groups](https://payloadcms.com/docs/fields/group) and
[tabs](https://payloadcms.com/docs/fields/tabs) to organize the form, and
[relationships](https://payloadcms.com/docs/fields/relationship) to select shared
records. A page remains one editing entry even when it references several
collections.

### Program pages

AI², EigenAI, and ML Fundamentals remain under Pages, each with a form suited
to its approved layout. EigenAI references its conference event, which owns
the dates, venue, schedule, and speaker selections. ML Fundamentals initially
keeps its curriculum and resource lists inside its page.

Promote nested content to a collection when it needs independent management
or reuse. A schedule entry, FAQ, or curriculum week does not need its own
collection simply because it repeats. New content types must come from actual
site needs; research papers or podcasts do not become collections merely
because a future page could use them.

## Media and links

Use the media library for reusable images and documents. Keep default alt text
and descriptive metadata with the asset, with contextual alt text or captions
on a placement when needed. Editorial image selection belongs in the CMS;
decorative effects and component-specific rendering remain in code.

Existing repository assets can remain in place until their media migration is
implemented. Upload storage, delivery, file validation, and access must be
configured before editors replace those assets through the CMS. Public media
does not include resumes or other private application files.

Resource lists can link to existing slides, PDFs, videos, repositories, or
external articles. A linked PDF does not require a separate Papers collection.
Validate destinations and file references; editors should not need to enter
repository paths or arbitrary HTML.

## Drafts and publishing

Use [Payload drafts and versions](https://payloadcms.com/docs/versions/drafts)
consistently for publishable content. The intended workflow is **Save Draft →
Preview → Publish**. Saving edits retains the last published version until an
editor publishes the replacement. Previewing drafts requires editor access;
public readers use published content even when the visitor has an editor session.

Publishing a page does not publish its referenced drafts. Publish required
shared records before publishing a page that needs them. Publishing a shared
record affects every page referencing it, including pages with no new edits.
Pages and referenced records are separate publication units, so a page version
does not provide an atomic release or rollback of all its shared content.

Validate required sections, fields, and references before publication. Required
missing content must produce an explicit failure when CMS reads are selected;
it must not silently substitute fixtures or static content. Optional lists may
be empty where the approved layout supports that state. Define the handling of
unpublished or deleted references in each public reader.

## Access and application data

Editor roles, collection permissions, and publishing authority are agreed and
implemented through [editor access control](https://github.com/UTMIST/UTMIST/issues/514).
Navigation groups organize work; they do not grant access. A public People
record is not an editor account or a Supabase member identity.

Applicant records, applications, registrations, member accounts, and other
operational data remain in their existing application systems. Careers owns
the public opening; recruitment owns the application process. Events owns
public event content; registration processing remains feature backend logic.

The `CMS-Access` availability flag remains separate from editor authorization.
Follow the shared reader's environment policy and the [publishing handoff](https://github.com/UTMIST/UTMIST/issues/515)
for production rollout. Publishing a document does not itself enable CMS reads
in Production.

## Applying the structure

The [collection setup](https://github.com/UTMIST/UTMIST/issues/512) inventory maps
current source files and public surfaces to this structure, including Careers
and Events. Review the actual fields, relationships, and media rules before
creating collections and seeds. Keep seeds repeatable without overwriting
editorial changes, and use checked-in migrations for schema changes.

The [content transfer](https://github.com/UTMIST/UTMIST/issues/513) connects and
verifies one page or small batch at a time, using the shared typed reader and
the agreed editor navigation. During transfer, replace embedded copies of
shared records with relationships. Retain original content until its consumer
has moved and the replacement has been verified.

Move `proofs` and any superseded `content-sections` records out of normal editor
navigation after their consumers have migrated. Preserve data deliberately;
reorganizing navigation does not imply deleting records. Record implementation
progress, rollout results, and acceptance evidence in the relevant issues and
PRs.
