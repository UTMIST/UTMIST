# Contributing

Welcome to the UTMIST website team. This page covers how work gets from an issue
to `main`.

New here? Start with [docs/Setup.md](docs/Setup.md) and get the site running
locally first — everything below assumes you have it up.

This page is the mechanics. The people side — your first week, what owning a
zone means, review turnaround, weekly expectations — lives in
[docs/ONBOARDING.md](docs/ONBOARDING.md).

## Picking something to work on

All work starts from an [issue](https://github.com/UTMIST/UTMIST/issues).

Every issue carries an **area** saying what kind of work it needs:
`area: content` (copy, images, listings — no dev context needed),
`area: product` (something a visitor would notice), or `area: engineering`
(refactors, tests, tooling — no visible change). Filtering by area is the
fastest way to find work that matches what you want to do; see
[docs/AREAS.md](docs/AREAS.md).

- **First contribution?** Filter by
  [`good first issue`](https://github.com/UTMIST/UTMIST/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).
  These are scoped so you can finish them without deep context on the codebase.
- Issues are prioritized `P0` (highest) through `P3`. If you have no preference,
  take the highest-priority thing that is unassigned.
- Filter with `-is:blocked` to hide anything waiting on another issue. The
  `ready` label is narrower and better: it means an issue's blockers have all
  closed and nobody has claimed it yet, so that is the queue to pull from. See
  [Blocked and ready](#blocked-and-ready) below.
- **Comment on the issue to claim it**, and it will be assigned to you. This
  stops two people building the same thing — which has happened here before.
- If nothing fits, open an issue with the
  [bug](.github/ISSUE_TEMPLATE/bug_report.md) or
  [feature](.github/ISSUE_TEMPLATE/feature_request.md) template and say you would
  like to take it.

If you get stuck or go quiet on an issue, say so in a comment and unassign
yourself. Stalled-but-assigned issues are worse than open ones.

## Blocked and ready

Say what an issue depends on using GitHub's built-in **issue dependencies** —
open the issue, and under **Relationships** in the sidebar add it to
**Blocked by**. That list is the source of truth; there is nothing to write in
the issue body.

**There is no `blocked` label, deliberately.** GitHub indexes dependency state
itself, so `is:blocked` in issue search already returns exactly the set a label
would have carried. A label would be a second copy of the same fact and could
drift out of date; the search qualifier is computed when you run it and cannot.

- **Available work:** [`-is:blocked`](https://github.com/UTMIST/UTMIST/issues?q=is%3Aissue+is%3Aopen+-is%3Ablocked)
- **Everything waiting on something else:** [`is:blocked`](https://github.com/UTMIST/UTMIST/issues?q=is%3Aissue+is%3Aopen+is%3Ablocked)

From there,
[a workflow](.github/workflows/blocked-ready-automation.yml) keeps the `ready`
label in sync. Do not set it by hand — the next run will overwrite you.

- Once every blocker on an issue is closed, it gets `ready`. Reopen a blocker
  and `ready` comes off again.
- Claiming an issue (which assigns it to you) drops `ready`, because it is no
  longer up for grabs. Unassigning yourself puts it back on the queue.
- An issue with no dependencies at all is left alone — it never gets `ready`.
  So `ready` means "this was blocked and now isn't", not "any open issue".

That last point is why `ready` survives while `blocked` did not: it describes a
*transition*, which no search can express. `-is:blocked no:assignee` looks
similar but is a much larger set, because it also includes everything that was
never blocked in the first place.

If the repo has a `PROJECTS_TOKEN` secret configured, the same transitions set
the card's **Status** on the
[project board](https://github.com/orgs/UTMIST/projects/12). Moving a card on
past that is still a human step.

One quirk worth knowing: GitHub does not let a workflow trigger on a dependency
being added or removed, so that one change is picked up by a sweep that runs
every half hour rather than instantly. Closing a blocker, opening an issue, and
claiming one all update immediately. If you need it now, run the workflow
manually from the Actions tab.

## Zones & ownership

The codebase is split into ownership **zones** — design system, platform,
DevEx/CI-CD, and one per feature (public site, recruitment, careers, events,
members). [docs/ZONES.md](docs/ZONES.md) is the map: each zone's mission,
paths, and owner. Read it before touching code outside the feature you already
know, so you know whose lane you're in.

Zones attach to **code**, so you never pick one yourself. When you open a PR,
path-based labeling reads the files you changed, applies a `zone:<name>` label
for each zone they touch, and CODEOWNERS requests review from those owners. A PR
touching two zones gets both labels and both reviewers — a sign it may be worth
splitting.

This is why issues carry an [area](docs/AREAS.md) and not a zone. When an issue
is filed, which code it will touch is often the thing nobody knows yet; what kind
of work it is, is answerable straight away. The two lists are independent and do
not map onto each other.

## Branches

Branch off the latest `main`:

```bash
git checkout main
git pull
git checkout -b feat/142-add-events-filter
```

Name branches `type/issue-number-short-description`, using the same types as
commits below. The issue number is what lets a reviewer find the context.

Never commit directly to `main` — it deploys to production on every push.

## Commits

Write [Conventional Commits](https://www.conventionalcommits.org/):

```
type: short summary in the imperative mood
```

| Type | For |
| --- | --- |
| `feat` | A new user-facing capability |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no behaviour change |
| `refactor` | Restructuring with no behaviour change |
| `test` | Adding or fixing tests |
| `chore` | Tooling, CI, dependencies |

```
feat: add department filter to events page
fix: prevent duplicate resume upload on double submit
chore: bump next to 16.0.8
```

If the change needs explaining, add a body after a blank line and say **why**,
not just what. The diff already shows what changed; it cannot show what you were
working around or what you ruled out.

## Before you push

Run the same three checks CI gates on:

```bash
cd client
npm run lint && npm run typecheck && npm test
```

All three must pass. If lint reports something it can fix itself, `npm run
lint:fix` will handle it.

Add tests for behaviour you add or fix — see
[docs/client/Testing.md](docs/client/Testing.md), which includes a template and
cookbooks for the common cases (mocking Supabase, `next/navigation`, async server
components).

## Pull requests

Push your branch and open a PR against `main`. Fill in the template: what
changed, why, the issue it closes, and screenshots for anything visual.

- **Link the issue** with `Closes #142` so it closes on merge.
- **Keep PRs small.** A `size/xs` or `size/s` label gets reviewed in a day;
  `size/xl` can sit for weeks. The label is applied automatically. If a change is
  genuinely large, say so in the description and explain how to read it.
- **Mark it draft** if it is not ready — a draft PR is a good way to get early
  feedback without asking anyone to do a full review.

### What CI checks

Every PR runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

| Step | Fails when |
| --- | --- |
| Lint | ESLint reports an error (warnings do not fail the build) |
| Typecheck | TypeScript reports an error |
| Test | Any Jest test fails |
| Build | `next build` fails — often a missing env var or a prerender error |

A merge to `main` deploys to production, so a green build is the last gate before
users see it.

### Review

The owners of the zones your PR touches review it (requested automatically
via CODEOWNERS) and either approve or request changes. The turnaround
expectation — 48 hours, both directions — is in
[docs/ONBOARDING.md](docs/ONBOARDING.md#pull-requests). Push follow-up
commits to the same branch; do not force-push once review has started, as it
makes review comments hard to follow.

Receiving review: it is fine to push back. If a suggestion seems wrong, say so
and explain why — that conversation is the point. Do not silently apply a change
you believe is incorrect.

Once approved, a maintainer merges. Delete your branch afterward.

## Dependency updates

[Dependabot](.github/dependabot.yml) opens dependency PRs every Monday morning —
one set for the npm packages in `client/`, one for the actions in
`.github/workflows/`. They are labelled `dependencies` and `zone: devex`, and a
release has to be a week old before it is proposed, so a publish that gets
yanked never reaches us.

Related packages are grouped into a single PR (`next`, `react`, `supabase`,
`tailwind`, `testing`, `lint-and-types`), because bumping one of those without
the others just produces a type error. Everything else ships as one
minor-and-patch PR per week, with each major update on its own.

Reviewing one:

- **Read the release notes** in the PR body before the diff. For a grouped or
  patch-level PR that is usually the whole review — CI has already linted,
  typechecked, tested and built it.
- **Majors get a real look.** They arrive alone precisely so you can give them
  one. Check the migration notes for anything the build cannot catch: a
  changed default, a runtime bump, a dropped API we call.
- **Dependabot PRs do not get a Vercel preview** ([why](.github/workflows/ci.yml)).
  If a bump could move the UI — Next, Tailwind, a component library — push the
  branch under your own name and open a PR from it to get a preview.
- **If one breaks CI**, do not merge around it. Either fix it forward in a
  commit on the same branch, or comment `@dependabot ignore this major version`
  and open an issue for the upgrade so it does not silently reappear.

`@dependabot rebase`, `@dependabot recreate` and `@dependabot reopen` work as
comments on the PR too.

## Code conventions

Match the surrounding code. Beyond that:

- **TypeScript** throughout. `strict` is on; avoid `any`.
- **Tailwind** for styling. Reuse existing tokens and gradient utilities rather
  than adding new one-off colors — see [docs/client/styles/](docs/client/styles/).
- **Path alias:** import from `@/` (mapped to `client/src/`) rather than long
  relative chains.
- **Access control:** any surface exposing applicant data must sit behind
  `requireAdmin()` or `getAdminUser()`. See
  [client/README.md](client/README.md#two-layers-of-protection) — middleware
  alone is not enough.
- **Environment variables:** document every new one in
  [`client/env.example`](client/env.example), and add it to both GitHub Actions
  secrets and the Vercel project settings.
- **Documentation:** if you add a page or component, add a matching note under
  [docs/client/](docs/client/).

## Questions

Ask in the team channel, or comment on the issue you are working on. A question
asked early is much cheaper than a PR built on a wrong assumption.
