# Areas

Every issue gets an **area**. An area says *what kind of work the issue needs* —
how much engineering context it takes and what "done" looks like. Set the
**Area** dropdown on the task template and a workflow applies the matching
`area: <name>` label.

Areas are not zones. [Zones](ZONES.md) classify **pull requests** by the code
they touch, and are worked out automatically from the files a PR changes. Areas
classify **issues** by the kind of effort they need, and are declared by whoever
files them. The two lists are deliberately independent — there is no mapping
between them, and an issue never carries a zone label.

The reason they are separate: when an issue is filed, the honest answer to
"which code does this touch?" is often "nobody knows yet" — that is frequently
the work. But "is this a content update or an engineering job?" is answerable
immediately, and it is the question that decides who can pick it up.

## The areas

### content

Copy, images, data files, and listings. The site's information is out of date or
incomplete and needs updating — no change to how anything works.

**Typically:** sponsor and partner listings, member and project data, event and
workshop content, program page updates, replacing stale images.

**Who can take it:** anyone with repo access. No dev context required, though
some content lives in JSON or TSX and needs care with syntax.

**Done looks like:** the page shows the right information.

**Real examples:** "Add EngSoc & DCS to the 'Supported By' section", "MLF Week 1
content upload", "Add MLF TW members to the MLF page", "Project Images are not up
to date".

### product

A change to what the site can do, or to how it looks and behaves. New
capability, or user-visible breakage that needs fixing.

**Typically:** new pages and components, new flows, layout and interaction
changes, bugs a visitor would notice.

**Who can take it:** a dev. Usually needs to know the feature it lands in.

**Done looks like:** a visitor can do something they could not do before, or
something visibly broken now works.

**Real examples:** "Design and Implement Department Pages", "Implement Resume
Filtering by Graduation Year", "Add a sign out button in Profile Page", "Title in
Profile Page Overrides Name in Profile".

### engineering

Work on the codebase itself, with no user-visible change. Refactors, tests,
dependencies, CI, tooling, contributor docs.

**Typically:** extracting shared code, fixing patterns that will bite later,
build and lint config, repo hygiene.

**Who can take it:** a dev, usually one comfortable in the part of the codebase
being changed.

**Done looks like:** the site behaves exactly as before, and the code is easier
to work in.

**Real examples:** "Extract a shared useMounted() hook for the next-themes
hydration guard", "Evaluate set-state-in-effect in ApplicantsPageClient data
fetch", "Apply form defines a component during render".

## Areas vs. the type labels

Areas sit alongside the existing `bug`, `enhancement`, `documentation`, and
`design` labels rather than replacing them. Those say what *kind of report* an
issue is; areas say what *kind of work* it takes. A `bug` can be `area: content`
(wrong sponsor listed) or `area: product` (the profile page renders the wrong
name) — and the difference decides who picks it up.

## Picking one

- Does it only change words, pictures, or data? → **content**
- Would a visitor notice the difference? → **product**
- Would a visitor notice nothing at all? → **engineering**

If an issue genuinely spans two, split it. If you cannot tell, pick **not sure**
— that applies no label and flags it for triage, which is better than a wrong
one.

## Keeping the area list in sync

The area list is hand-maintained in `.github/ISSUE_TEMPLATE/task.yml` (the
canonical list), `.github/workflows/area-label-issues.yml`, and this doc. CI runs
`node scripts/check-taxonomy.mjs` (the **Taxonomy consistency** workflow) to
cross-check them, and to check that areas and zones have not leaked into each
other's files. If you add, rename, or remove an area, update all three, create or
delete the matching `area: <name>` label, and run the script locally before
pushing.
