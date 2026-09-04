# Joining the team

Welcome! This page covers the people side of contributing: what you're
responsible for, how work gets assigned, what we expect from a pull request,
and what we expect from you week to week.

It deliberately skips anything technical. That lives in two other docs:

- [`Setup.md`](Setup.md) walks you from a fresh clone to the site running
  locally.
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) covers the mechanics of getting a
  change from an issue to `main`: claiming, branches, commits, the checks CI
  runs, and how review works.

So if your question is "how do I run this?" or "what do I name my branch?",
those pages have the answer, not this one.

---

## Your first week

Work through these in order. Only steps 1 and 4 need anyone's permission.

1. **Get repo write access.** Ask @qiuethan.
2. **Read [`client/README.md`](../client/README.md)** top to bottom, then
   skim [`ZONES.md`](ZONES.md) and [`AREAS.md`](AREAS.md). Don't worry about
   retaining all of it. The goal is knowing what exists so you can find it
   again later.
3. **Work through [`Setup.md`](Setup.md)** until `npm run dev` serves the
   site and `npm run lint`, `npm run typecheck`, and `npm test` all pass on
   your machine. This proves your environment works before any real task
   depends on it.
4. **Tell @qiuethan which zones interest you.** The zone list in
   [`ZONES.md`](ZONES.md) is the menu. Your interests genuinely matter here;
   the final call just also has to balance what the org needs covered.
5. **Get your zone assignment** and read your zone's docs: its section in
   [`ZONES.md`](ZONES.md), and the notes under [`docs/client/`](client/) for
   the pages and components on its paths. As the zone's reviewer, those are
   the documents you'll be holding other people to.
6. **Claim an issue** by commenting on it (see
   [Getting work](#getting-work)). A
   [`good first issue`](https://github.com/UTMIST/UTMIST/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
   is scoped so you can finish it without deep context on the codebase.
7. **Get your first PR merged to `main`.** Small is ideal. The point of a
   first PR is to walk the whole loop once (branch, PR, Vercel preview,
   review, merge, production deploy), not to be impressive.

---

## Zones: what you're responsible for

Every dev owns one or more **zones**, the directory buckets defined in
[`ZONES.md`](ZONES.md). @qiuethan assigns them (see step 4 above), and the
assignment is recorded in `ZONES.md` and
[`.github/CODEOWNERS`](../.github/CODEOWNERS).

Owning a zone means three things:

1. **You're its reviewer.** When a PR touches your zone's paths, automation
   applies a `zone: <name>` label and CODEOWNERS requests your review. The
   [turnaround expectation](#pull-requests) below applies to you.
2. **You triage the issues headed its way.** Issues aren't labeled by zone
   (they carry [area](AREAS.md) labels instead), but most issues are clearly
   about some part of the site, and if that part is yours, the issue should
   hear from you. A label, a question, or a "won't do" all count. Silence
   doesn't.
3. **You keep its docs honest.** Your zone's section in
   [`ZONES.md`](ZONES.md), the [`docs/client/`](client/) notes for its pages
   and components, and the [`env.example`](../client/env.example) entries its
   code reads are part of the zone. If a PR would make them wrong, that's
   worth catching in review, and if you notice drift yourself, it's yours to
   fix.

Think of ownership as responsibility, not territory. Anyone can open a PR
against your zone. Owning it just means you're the one making sure what
merges is right.

---

## Getting work

**The issue queue is self-serve.** Find an unassigned issue, comment to
claim it, get to work. You don't need to ask first.
[CONTRIBUTING.md](../CONTRIBUTING.md#picking-something-to-work-on) explains
the labels you'll filter by: `area`, priority (`P0` to `P3`), and `ready`.
Blocked work is not a label — filter it out with `-is:blocked`, which GitHub
computes from the dependency graph itself.

Two conventions on top of that:

- **Default to work that lands in your own zones.** Issues aren't labeled by
  zone, so this is a judgment call about where the change will live, not a
  label to filter on. Picking up work in someone else's code is fine now and
  then. Just coordinate with that zone's owner on the issue before you
  start, so two people don't build the same thing.
- **High-priority issues get assigned directly.** If @qiuethan assigns you an
  issue, it jumps ahead of whatever you picked yourself.

One distinction worth having straight from day one: a **zone** applies to
code, and so to PRs (it decides who reviews). An **area** applies to issues
(it decides what kind of work it is, and so who can pick it up). The two
lists are independent and don't map onto each other. The full rationale
lives in [`ZONES.md`](ZONES.md) and [`AREAS.md`](AREAS.md).

---

## Pull requests

The mechanics (branch naming, commit format, the checks CI gates on) live in
[CONTRIBUTING.md](../CONTRIBUTING.md#pull-requests). These are the human
norms on top.

**Turnaround is 48 hours, both directions.** Reviewers respond to a
review-ready PR within 48 hours, and authors respond to review feedback
within 48 hours. "Respond" can just be "I need until Friday". The point is
that nobody is left wondering. If your reviewer blows past the window, ping
them on the PR, and if they're still silent, ask @qiuethan to reassign.

**One zone per PR.** If your PR picks up two `zone:` labels, that's a sign
it may be worth splitting, because it now needs two reviewers to agree.
Multi-zone PRs are sometimes the right call; say why in the description
rather than leaving it unexplained.

**A merge to `main` is a production deploy.** There is no staging branch:
the Vercel preview on your PR is where the change gets seen before users see
it, so actually look at it. Never commit to `main` directly.

---

## AI-assisted development

Using AI tools (Claude Code, Copilot, and friends) here is normal and
encouraged.

Two rules:

1. **Your agent follows [`AGENTS.md`](../AGENTS.md).** It's the compressed
   contract of this codebase's invariants, written specifically for coding
   agents. Point your tool at it.
2. **You own every line you submit.** "The AI wrote it" is not an answer in
   review. If you can't explain what a change does and why it's safe against
   the invariants in `AGENTS.md`, it isn't ready to submit.

**Missing a tool you want?** If there's an AI tool that would help you work
and you don't have access to it (a Claude subscription, an API key, an IDE
integration), tell @qiuethan. He'll see what he can do about getting you one.

---

## Time commitment

- **About 5 hours a week** is the baseline for staying an active
  contributor. This is a student org and nobody is counting hours, but zone
  ownership only works if owners are actually around.
- **If you go quiet for 2 weeks without a heads-up**, your zones get
  reassigned so the org isn't blocked. No hard feelings, and it's fully
  reversible: come back and you can take a zone again.
- **A heads-up beats disappearing.** Exam season, internships, life in
  general: all completely expected. A one-line "I'm out until March" to
  @qiuethan keeps your zones yours, held for you instead of reassigned.
