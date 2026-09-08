# Website roadmap: parallel work and platform audits

This is the working model agreed during the September 2026 roadmap review.
The [GitHub project](https://github.com/orgs/UTMIST/projects/12) and native issue
relationships contain the live tasks and dependencies.

## The two rules

1. **F4 audits the existing platform.** It records what exists, what is verified,
   and what needs a focused fix. Completing an audit does not mean its findings
   have been fixed or that a feature is approved for production.
2. **Each F/W epic owns the backend its outcome needs.** Feature developers own
   the relevant schema changes, APIs, adapters, and permissions as well as the
   UI. Shared-code changes still receive the appropriate platform review.

The deployed Supabase schema already includes `user`, `Jobs`, `Applicants`,
`Members`, `department_page`, and `ai2_leaderboard`. `Applicants` references
`Jobs` and `user`, and interview/acceptance status enums exist. This was verified
from schema metadata; it does not establish that access policies, application
integration, storage settings, or environment isolation are correct.

## What each epic owns

| Epic | Responsibility |
| --- | --- |
| [F1: Components](https://github.com/UTMIST/UTMIST/issues/270) | Shared primitives, examples, and adoption guidance |
| [F2: Payload](https://github.com/UTMIST/UTMIST/issues/343) | CMS runtime, shared reader/fixture contract, and one live proof |
| [F3: Flags](https://github.com/UTMIST/UTMIST/issues/271) | Flag provider/storage, targeting, beta preferences, and opt-in UI |
| [F4: Platform audit](https://github.com/UTMIST/UTMIST/issues/272) | Independent environment, schema, auth, permission, storage, and policy audits |
| [F5: Delivery](https://github.com/UTMIST/UTMIST/issues/273) | Deployment checks, isolation remediation, preview protection, and board automation |
| [W1: Recruitment](https://github.com/UTMIST/UTMIST/issues/274) | Candidate/posting data, intake, scoped review, scoring, resumes, scheduling, and notifications |
| [W2: Events](https://github.com/UTMIST/UTMIST/issues/275) | Event records, registration/capacity backend, organizer tools, and recaps |
| [W3: Publishing](https://github.com/UTMIST/UTMIST/issues/278) | Department collections, media, editors, and public content integration |
| [W4: Careers](https://github.com/UTMIST/UTMIST/issues/276) | Internal careers collection, migration, permissions, and listing integration |
| [W5: Redesign](https://github.com/UTMIST/UTMIST/issues/277) | Page-family redesign/adoption batches and staged integration/rollout |

Careers migration happens once, under W4. Event backend belongs to W2.
Recruitment intake verification #298 moves from F4 into W1, after the missing
implementation. No feature waits for the entire F4 audit epic to finish.

## How developers work in parallel

One technical owner publishes a small shared example. Feature developers then
propose the fields their feature needs and review the interface with that owner.
The PM makes sure the decision has an owner and a recorded result; the PM does
not need to design the interface.

| Task | Needs before it starts | What completes it |
| --- | --- | --- |
| Contract and fixtures | Existing system/requirements and a named technical reviewer | Typed interface and representative synthetic responses |
| UI against fixtures | Its agreed interface and required shared primitives | Reviewable behavior, including errors and empty states |
| Feature backend | Its contract and applicable environment/audit inputs | Working data access, permissions, and relevant tests |
| Live integration | Its UI, real adapter, and applicable access/isolation checks | Verified behavior with real persistence and synthetic test data |
| Release acceptance | Required integrations and resolved release blockers | Recorded feature acceptance and operational readiness |

Fixture UI completion is real progress, but it is not completion of the whole
feature. Production must not silently fall back to fixtures. Applicant surfaces
retain the server-side guards required by [AGENTS.md](../AGENTS.md); flags do
not grant access to data.

## PM operating routine

Keep tasks directly under their F/W epic and connect only hard prerequisites
through native Relationships. Preserve the existing area/priority/effort labels;
zone labels still belong to PRs. Keep existing assignees, and claim other work
through the process in [CONTRIBUTING.md](../CONTRIBUTING.md).

Ask each contributor: **What can you build now? What specific thing are you
waiting for? Who is providing it?** Split a task when its missing integration
hides useful work that could already start.

Use [the available, unclaimed task queue](https://github.com/UTMIST/UTMIST/issues?q=is%3Aissue+is%3Aopen+-label%3Aepic+-is%3Ablocked+no%3Aassignee)
(`is:issue is:open -label:epic -is:blocked no:assignee`). The `ready` label has its existing, narrower meaning: previously
blocked work whose dependencies are closed and which is unassigned. Do not set
that label manually.

Project **Status** tracks progress only: **Not Started → In Development →
In Review → Done**. Blocked and Ready are retired board statuses. Keep
dependencies in native Relationships and use `is:blocked` filters; dependency
changes must not overwrite development or review progress. The `ready` label
continues to follow its existing rules independently of Status. The automation
cleanup is tracked in [F5.10](https://github.com/UTMIST/UTMIST/issues/375).

Start with the independent F4 audits, the shared CMS/flag examples, and the
remaining department decisions. Then pull the resulting UI/backend tasks as
their specific prerequisites close. Keep January recruitment and the December
freeze as the existing scheduling constraints; internal Careers remains scoped
without partner submissions or billing.
