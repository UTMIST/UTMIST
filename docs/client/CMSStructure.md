# CMS content structure

This is the developer reference for the CMS migration: what content belongs
where, which records each page uses, and how editors manage and publish it.
Editors change content within developer-approved page layouts.

This is the target structure for the migration. Implementation is tracked in
[#512](https://github.com/UTMIST/UTMIST/issues/512) and
[#513](https://github.com/UTMIST/UTMIST/issues/513).

For the running CMS, see [setup and migrations](Payload.md) and
[public content reads](ContentReader.md).

## Content placement rules

- **Create collections for existing needs.** Add one when records need
  independent management or reuse. Repeating fields alone do not justify a
  collection; keep nested lists on their page until that need exists.
- **Keep page-specific content on the page.** This includes copy, section
  headings, calls to action, FAQs, and search/sharing metadata.
- **Store shared facts once.** Pages select shared records through
  relationships and own the selection order. They do not copy those records'
  fields into their own content.
- **Keep context with the reference.** A record's role on a particular page
  or event belongs alongside that reference.
- **Keep site-wide content in Site settings.** Layouts, styling, animations,
  and application behavior stay in code.

## Collections and navigation

The table defines the target admin groups, labels, and identifiers. Check the
source inventory in #512 before adding fields or creating each collection.

| Admin group | Entry and identifier | What it stores |
| --- | --- | --- |
| Website | Pages — `pages` | Page copy, fixed sections, metadata, and selections of shared records |
| Website | Site settings — `site-settings` global | One record for shared contact details, social links, navigation labels/links, and footer content |
| Content | Events — `events` | Dates, venue, description, registration link, speakers, sponsors, schedule, and recap resources; event/edition rules still need agreement below |
| Content | Projects — `projects` | Name, description, category, image, repository, and destination links |
| Content | Article links — `posts` | Listings that link to external articles, currently sourced from [posts.json](../../client/src/assets/posts.json). No hosted article body or individual article route. |
| Content | Sponsors and Partners — `partners` | Organization name, logo, and website. Sponsorship tier stays with the page/event placement. |
| Content | People — `people` | Public name, photo, bio, and profile links. Program/event roles stay with the relevant roster. |
| Content | Careers — `careers` | Internal opening, department, description, application link, and opening/closing information |
| Content | Startup listings — `startups` | Company names, descriptions, and logos currently embedded in the [Startups page](../../client/src/features/public-site/pages/startups.tsx). No individual startup route. |
| Assets | Media — `media` | Shared images/documents and descriptive metadata |
| Administration | CMS users — `cms-users` | Editor accounts and access configuration |

## Page records

Create one record in Pages for each route below. Its form contains the fields
needed by that page's approved layout.

| Page | Route | Content owned by the page |
| --- | --- | --- |
| Home | `/` | Hero, about, impact, mission, community copy, startup benefits, FAQ, and featured selections |
| Departments | `/departments` | Department copy and public team rosters |
| Sponsors | `/sponsors` | Introduction, advertised sponsorship packages, contact CTA, and sponsor selections |
| Projects | `/projects` | Introduction and project listing configuration |
| Blog | `/blog` | Introduction and featured/recent/archive selections from Article links |
| Startups | `/startups` | Program copy, gallery, startup selections, and partner selections |
| Careers | `/careers` | Introduction and opening-list configuration |
| Events | `/events` | Introduction and event-list configuration |
| AI² | `/ai2` | Program copy and fields for its approved template |
| EigenAI | `/eigenai` | Conference-page copy and a reference to its event edition |
| ML Fundamentals | `/ml-fundamentals` | Program copy, curriculum, resource lists, FAQs, and team rosters |

### Editing rules

- Developers control route mapping, page identifiers, and template assignment.
- Editors work in fixed, named groups or tabs. Section order is defined by the
  template; editors can reorder entries within its lists.
- Each required section appears exactly once. Drafts may be incomplete;
  publishing validates the required fields and structure.
- Keep AI², EigenAI, and ML Fundamentals under Pages with their own forms.
  The shared collections supply the records those forms reference.

### Example: Home editor

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

### Example: sponsor content

| Information | Where it belongs |
| --- | --- |
| Organization name, logo, website | Sponsors and Partners record |
| Which sponsors Home shows, and in what order | Home's Sponsors section |
| A sponsor's tier for an EigenAI edition | Sponsor reference on that event |
| Price and benefits of an advertised sponsorship package | Sponsors page |

## Publishing rules

- Use native drafts and versions for publishable content:
  **Save Draft → Preview → Publish**.
- Saving a draft retains the last published version. Draft preview requires
  editor access; public readers use published content even for signed-in editors.
- Publish required shared records before a page that references them.
  Validate required fields and references before publishing. Publishing the
  page does not publish its referenced drafts.
- Publishing a shared record affects every page that references it.
  Restoring a page version does not restore those shared records.
- When CMS reads are selected, missing required page content fails explicitly.
  Readers must not silently substitute static content or fixtures. Optional
  lists may be empty where the layout supports it.
- The shared reader controls environment eligibility and `CMS-Access` source
  selection. Publishing a record does not enable CMS reads in Production.

Unpublishing/deletion behavior for shared references is an open decision below.

## Media rules

- Store shared assets and default descriptions in Media. Keep contextual
  captions or alt text with the page/event placement when needed.
- Keep existing repository assets until upload storage, delivery, validation,
  and access are implemented. Resource lists can continue linking to external
  slides, PDFs, videos, and articles.
- Validate links and asset references. Editors should not need repository
  paths or arbitrary HTML.

## Access rules

- Public collections contain content intended for publication. Internal notes
  and private data require separate access controls; website visibility alone
  does not control API access.
- Navigation groups do not grant permissions. `CMS-Access` controls availability;
  editor roles and publishing authority belong to #514.
- Public People records are separate from editor and member accounts.
- Applicant data, private files, registration processing, and other operational
  data stay in the existing application systems. Careers supplies public
  listings; recruitment handles applications.

## Decisions still needed

These details must be agreed before implementing the affected collections or
readers. The table records open questions, not additional settled requirements.

| Decision | What needs to be settled | Track in |
| --- | --- | --- |
| Events and program cards | Home currently features ongoing initiatives and external conferences. Decide how those cards relate to dated events, how editions are retained, and what an unannounced edition displays. | #512 / #513 |
| Unpublished or deleted references | Set a common rule for unavailable list entries and required single references, including whether unpublishing/deleting an in-use record is blocked or warned. | #513 |
| Page forms and record controls | Define how one Pages collection supplies each fixed form, and how page creation, deletion, and identifier changes are restricted. | #512 / #514 |
| Media lifecycle | Define draft behavior, file replacement, and deletion of assets used by published content. | #512 / #514 |
| Editor permissions | Agree collection/field access, draft visibility, and who can publish shared records that affect other pages. | #514 |

## Implementation and handoff

| Work | Responsibility |
| --- | --- |
| [#512 — Collection setup](https://github.com/UTMIST/UTMIST/issues/512) | Inventory sources, review fields/relationships, add collections, and provide migrations and seeds that preserve editorial changes |
| [#513 — Content transfer](https://github.com/UTMIST/UTMIST/issues/513) | Connect and verify pages in small batches, replace duplicated content with references, and organize the editor navigation |
| [#514 — Editor access](https://github.com/UTMIST/UTMIST/issues/514) | Agree, implement, and verify permissions |
| [#515 — Publishing handoff](https://github.com/UTMIST/UTMIST/issues/515) | Verify owner workflows and record the production rollout decision |

Retain original content until its replacement is verified. Move `proofs` and
superseded `content-sections` out of normal editor navigation after their
consumers migrate; changing navigation does not imply deleting records.
Keep rollout evidence and progress updates in the issues and PRs.

## Payload references

- [Groups](https://payloadcms.com/docs/fields/group) and [tabs](https://payloadcms.com/docs/fields/tabs) for editing forms
- [Relationships](https://payloadcms.com/docs/fields/relationship) for shared records
- [Globals](https://payloadcms.com/docs/configuration/globals) for Site settings
- [Drafts and versions](https://payloadcms.com/docs/versions/drafts) for publishing
- [Field access](https://payloadcms.com/docs/access-control/fields) for API visibility
