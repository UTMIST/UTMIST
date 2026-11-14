# Project board automation

[Web project 12](https://github.com/orgs/UTMIST/projects/12) tracks issues and PRs
separately. This port adapts [Misty #344](https://github.com/UTMIST/Misty/pull/344)
at `c8f33367a52d0b28d965da83ba02bf407b29ac3d`, plus its contributor and agent
guidance, to web's existing four statuses and Vercel CI deployment.

## Progress, availability and acceptance

Status means progress: **Not Started → In Development → In Review → Done**.
Only Status and the `ready` label are reconciled; priorities, assignees, dates,
descriptions and acceptance checkboxes are not rewritten.

| Current evidence | Reconciled progress |
| --- | --- |
| New issue without linked PR | Not Started |
| Open draft PR or changes requested | PR and closing-linked issue → In Development |
| Open non-draft PR awaiting review or approved | PR and closing-linked issue → In Review |
| Multiple linked PRs, any requiring rework | Issue → In Development |
| Explicit `on hold` issue, or all its open PRs held | Not Started |
| Closed issue | Done; remove ready |
| Merged PR or PR closed without merging | PR → Done |
| Reopened issue, or abandoned review PR | Leave Done/review; assigned issue → In Development, otherwise Not Started |

An approved PR stays In Review until merge. Done on an abandoned PR records its
disposition, not shipped functionality. A held PR cannot complete its issue;
other non-held linked PRs still drive progress. Without linked evidence, manually
set In Development/In Review is retained. Use `on hold` for a deliberate pause.

Dependencies use native **Blocked by** relationships and `is:blocked` search,
never issue-body parsing or a `blocked` label. They never change Status. An
issue gets `ready` only while open, unassigned, Not Started, not held, without
an open closing-linked PR, with at least one dependency and all dependencies
closed. Reopening a blocker removes ready; issues without dependencies never
receive it. Unknown dependency state is unresolved.

Put `Closes #123` in the PR description only when merging finishes the entire
issue. Use `Part of #123` for partial delivery, and retain outstanding hosted
acceptance in an open issue. GitHub's explicit closing links own closure when a
PR merges into **main**. The reconciler never closes implementation issues or
epics and never derives issue completion from a merged PR alone. See GitHub's
[closing-link rules](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue).

## Repository workflows

| Workflow | Trigger and result |
| --- | --- |
| [Sync project board](workflows/project-board.yml) | Issue/PR/review events, hourly, manual; current-state reconciliation and missing-card backfill |
| [Check automation health](workflows/automation-health.yml) | Daily and after the other automation workflows finish; one reusable incident, closed on recovery and reopened on recurrence |
| [Check PR issue links](workflows/pr-issue-check.yml) | PR description/lifecycle/label updates, manual; advisory annotations and summary, no comments or required merge gate |
| [Review board exceptions](workflows/board-review.yml) | Monday at 13:43 UTC, manual; one reusable weekly report including epic acceptance candidates |
| [Record deployment evidence](workflows/deployment-evidence.yml) | Completed main CI push, manual; one updatable comment per deployment/target on the exact merged PR and its same-repo closing issues |

Controllers read current API state rather than replaying event payloads. Top-level
collections are paginated; truncated relationships fail visibly before board
writes or deployment comments. Closed issues with stale ready labels are cleaned
up even outside the board, without adding or unarchiving their cards.
Archived closed history stays archived; reopened
items are restored. Reports labeled `automation/report` are excluded; health
incidents remain actionable work. Keep bot markers and labels on managed issues.
Duplicate bot reports fail instead of choosing one arbitrarily.

The health monitor checks workflow enablement, failures, project access and the
four Status options. Board scheduled success expires after four hours and weekly
success after nine days, with the same startup grace for newly created workflows.
Manual dry runs cannot renew scheduled heartbeats. CI failures use existing CI
notifications; disabled CI is a health finding. The monitor cannot detect its own
disablement or a GitHub Actions outage externally.
Health checks triggered by any manually dispatched parent workflow are read-only,
so a parent dry run cannot publish an incident indirectly. Dispatch health itself
with `dry_run=false` for an intentional manual incident update.

PR advice verifies description references and native closing links. Documentation
and Dependabot PRs are exempt from missing-link warnings; maintainers can apply
`no-issue-needed` for another justified exception. Exemptions do not suppress
epic/unchecked-acceptance advice. Inspection failures fail the job; advice itself
does not. Native link edits may require a manual rerun with `pr_number`.

The weekly report lists review PRs without activity for three days, approved PRs
for two days, unassigned project P0/P1 issues, and holds inactive for fourteen
days. Ages use GitHub's updated timestamp. Epics are candidates only when all
native direct sub-issues are closed; cancelled children and unchecked parent
criteria remain explicit review items. It never closes an epic, assigns work or
resumes a hold. Closing the report does not disable it; the next run reopens it.

## Vercel deployment evidence

The production CI job records a GitHub deployment attempt after the prebuild and
before `vercel deploy`. It supplies the exact commit as Vercel metadata, then
checks the [Vercel deployment API](https://vercel.com/docs/rest-api/deployments/get-a-deployment-by-id-or-url)
for the configured project, production target, commit and READY state before
recording success. Failure/cancellation or unverified results remain failure/error;
a build failure before deployment produces no deployment record.

Project: `prj_L6wyTsPfqVyJGmheCUenmIutXtJz`.
Team: `team_xAGWQZLeFUyvgLA8iOTNJFnu`.

The evidence workflow uses `workflow_run`: deployment writes made with
`GITHUB_TOKEN` do not trigger another `deployment_status` workflow. It verifies
the source workflow path, main push, repository, run attempt, recorded SHA and bot
provenance. It reads fresh deployment status, never downloads run artifacts or
executes code from the triggering run. An exact merged PR commit is required;
preview deployments, open PRs and later PRs merely containing that commit are
excluded. Direct pushes can have deployment records without an associated PR.

Evidence is a dated observation, not end-to-end acceptance or a current-serving
guarantee. A runner terminated before its final step may leave in_progress; the
comment does not turn that into success. A later rerun has its own attempt/record.
Manual dispatch takes a main CI `run_id` and inspects its latest attempt.

## Credentials and native settings

`PROJECTS_TOKEN` is an Actions-only secret: project 12 read/write and repository
metadata access (classic PAT scopes `project`, plus `repo` for private repos).
Configure it directly in GitHub, never in source or chat. Board/report jobs fail
visibly without it; the independent health job can still report that failure with
`GITHUB_TOKEN`. This is not an application environment variable and does not belong
in `client/env.example` or Vercel settings. Existing `VERCEL_TOKEN` stays confined
to the production deployment/verification job; the commenting workflow needs none.

All privileged controllers check out the default branch with persisted credentials
disabled. Fork review events lack the project secret and rely on the scheduled
reconciliation. Offline tests run on the normal event ref, including merge groups.

Read-only API inspection on 2026-10-27 found native auto-add, auto-add sub-issues
and auto-archive enabled. Native progress rules and Auto-close issue were disabled.
The API does not expose their filters/status configuration. Keep Auto-close issue
disabled: moving a card must not silently accept issue scope. Repository
reconciliation supplies progress updates; no native progress rules are required.

Before publishing reports, inspect native **Auto-add** in the project UI and set
repository `UTMIST/UTMIST`, filter `is:issue,pr is:open -label:"automation/report"`.
Keep auto-add sub-issues enabled. Do not manually add reports as deliverables or
sub-issues. Native auto-add does not backfill old work; the reconciler does.

## Activation and recovery

The repository implementation (#501) and [hosted activation (#502)](https://github.com/UTMIST/UTMIST/issues/502)
are separate. At initial
inspection the repository secret list had no PROJECTS_TOKEN; organization-secret
visibility could not be checked with the local login. No live board/report writes
or deployment were performed during implementation.

After review and merge into main:

1. Configure PROJECTS_TOKEN and verify the native report exclusion above. Create
   `on hold`, `no-issue-needed`, `automation/report`, `automation/health` labels;
   managed reports also create their own automation label if absent.
2. Dispatch Sync project board with `dry_run=true`. Review proposed changes and
   token access before `false`. Inspect representative cards, repeat the dry run
   and confirm convergence. Do not revive the retired readiness workflow.
3. Exercise draft → review → changes requested → approved → merge and unmerged
   close/reopen using legitimate work, including multiple linked PRs and holds.
   Check native dependency changes remove/restore ready without moving Status.
4. Dry-run weekly review and health, inspect summaries, then enable their writes.
   Verify one reusable report/incident and recovery/reopen behavior.
5. Inspect PR-link advice for an existing PR. Observe a real main deployment and
   replay its CI run with Record deployment evidence (`dry_run=true`, then false).
   Verify one comment per target/record and no claims about end-to-end acceptance.
6. Verify hosted scheduled runs after their first execution. Local read-only
   previews do not validate the Actions secret, events, writes or scheduler.

Schedules/events write by default once merged, so arrange credentials and report
exclusion before merge, or disable the new workflows until this rollout sequence
is ready. Manual dispatch defaults to dry-run. Do not merge with an unplanned
credentials gap that would replace working readiness with a failing controller.

Disable Sync project board to pause progress/ready writes; disable the other
workflows independently to pause their reports/comments. Keep health enabled to
surface unintended disables. Correct the credential/schema, dry-run, then write
and verify convergence. Roll back through a reviewed PR if necessary; historical
evidence and acceptance issues should remain intact.

## Validation

Run `node --test .github/scripts/*.test.cjs` on Node 24, Actionlint on changed
workflow YAML, `node scripts/check-taxonomy.mjs`, and the client lint/typecheck/test
gates. Tests cover lifecycle transitions, holds, native dependencies, dry runs,
pagination, archived work, race protection, report ownership/deduplication,
advisory exemptions, stale schedules, credential failures, epic cancellation,
provider verification and exact commit association.

The initial local read-only preview inspected 124 issues and 7 PRs and proposed
13 card changes, with no label changes. It identified review PRs #442/#494 and
49 unassigned P0/P1 issues. PR #500 produced no link warnings. Health correctly
reported the five new workflows absent before merge; project access used the
local login, not the Actions secret. A read of the existing READY production
deployment confirmed the Vercel response shape used by the verifier. No board,
report, comment or deployment writes were made by those previews.
