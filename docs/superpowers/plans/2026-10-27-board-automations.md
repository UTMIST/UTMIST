---
goal: Port Misty board and operational automations to UTMIST web
version: 1
date_created: 2026-10-27
last_updated: 2026-10-27
owner: DevEx / CI-CD
status: Ready for review
tags: [automation, github-actions, project-board]
---

# Introduction

![Status: Ready for review](https://img.shields.io/badge/status-ready_for_review-blue)

Implement #501 using Misty PR #344 at `c8f33367a52d0b28d965da83ba02bf407b29ac3d`
and its documentation companions #345/#346. Adapt behavior to this repository;
hosted activation remains separate acceptance work.

## 1. Requirements & Constraints

- REQ-001: Reconcile project 12 issue/PR progress using Not Started, In Development,
  In Review and Done, explicit holds and current closing links.
- REQ-002: Native dependencies remain the source of truth. They never change
  progress. Maintain only ready; do not restore a blocked label or Ready column.
- REQ-003: Add health incidents, PR-link advice, weekly exceptions and epic review.
- REQ-004: Attach actual production deployment evidence to exact merged work.
- SEC-001: Privileged workflows execute default-branch code, never PR code.
  Dry runs make no writes. Fail incomplete reads before writing.
- CON-001: Preserve acceptance scope; automation never closes implementation
  issues or epics. GitHub closing links own issue completion.
- CON-002: Node 24; client lint/typecheck/tests and taxonomy pass before push.

## 2. Implementation Steps

### GOAL-001: Adapt and verify repository automation

| Task | Description | Completed | Date |
| --- | --- | --- | --- |
| TASK-001 | Inspect Misty changes, web project schema, credentials and deploy flow | Yes | 2026-10-27 |
| TASK-002 | Port board, reports, PR advice and offline regressions | Yes | 2026-10-27 |
| TASK-003 | Record and verify Vercel deployment results and associate exact PRs | Yes | 2026-10-27 |
| TASK-004 | Update contributor guidance and publish activation/recovery runbook | Yes | 2026-10-27 |
| TASK-005 | Run checks and review, prepare implementation PR and activation issue | Yes | 2026-10-27 |

## 3. Alternatives

- ALT-001: Copy Misty's statuses, body dependencies and Railway IDs unchanged.
  Rejected: conflicts with web's existing policy and deployment provider.
- ALT-002: Treat successful CI as deployment proof. Rejected: build and deploy
  are separate; record an actual deploy and verify the Vercel response.

## 4. Dependencies

- DEP-001: PROJECTS_TOKEN with project 12 access must be configured for hosted
  board writes; repository secret is absent as of the initial inspection.
- DEP-002: Existing VERCEL_TOKEN, pinned Vercel project/team, GitHub Actions token.
- DEP-003: Reviewed code must merge into main before default-branch automation runs.

## 5. Files

- `.github/scripts/`: controllers, provider adapter and offline tests.
- `.github/workflows/`: events, schedules, credentials, trusted checkout and CI tests.
- `.github/PROJECT-BOARD.md`: operation, evidence limits and activation checklist.
- `CONTRIBUTING.md`, `docs/ONBOARDING.md`, `AGENTS.md`: contributor/agent policy.
- `scripts/ready-label.test.mjs`: replaced by controller behavior tests.

## 6. Testing

- TEST-001: Node offline suites for transitions, holds, pagination, failure paths,
  idempotence, report ownership, deployment trust and exact commit association.
- TEST-002: Actionlint, taxonomy and all three client gates.
- TEST-003: Authenticated read-only board/report previews; no live report writes.
- TEST-004: After merge, hosted dry runs, convergence, lifecycle and scheduled
  acceptance tracked in the activation issue.

## 7. Risks & Assumptions

- RISK-001: Local authentication does not prove the Actions secret works.
- RISK-002: Project workflow API exposes enabled states but not auto-add filters;
  report exclusion needs inspection in the native project settings UI.
- ASSUMPTION-001: Existing four statuses/native dependencies stay authoritative.
- ASSUMPTION-002: Preserve CI's existing production deployment flow; add evidence
  without treating deployment as end-to-end acceptance.

## 8. Related Specifications / Further Reading

- [Contributor workflow](../../../CONTRIBUTING.md)
- [Misty automation PR](https://github.com/UTMIST/Misty/pull/344)
- [Web implementation issue](https://github.com/UTMIST/UTMIST/issues/501)
- [Hosted activation and acceptance](https://github.com/UTMIST/UTMIST/issues/502)
