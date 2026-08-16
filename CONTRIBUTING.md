# Contributing

Welcome to the UTMIST website team. This page covers how work gets from an issue
to `main`.

New here? Start with [docs/Setup.md](docs/Setup.md) and get the site running
locally first — everything below assumes you have it up.

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
- **Comment on the issue to claim it**, and it will be assigned to you. This
  stops two people building the same thing — which has happened here before.
- If nothing fits, open an issue with the
  [bug](.github/ISSUE_TEMPLATE/bug_report.md) or
  [feature](.github/ISSUE_TEMPLATE/feature_request.md) template and say you would
  like to take it.

If you get stuck or go quiet on an issue, say so in a comment and unassign
yourself. Stalled-but-assigned issues are worse than open ones.

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

A maintainer reviews and either approves or requests changes. Push follow-up
commits to the same branch; do not force-push once review has started, as it
makes review comments hard to follow.

Receiving review: it is fine to push back. If a suggestion seems wrong, say so
and explain why — that conversation is the point. Do not silently apply a change
you believe is incorrect.

Once approved, a maintainer merges. Delete your branch afterward.

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
