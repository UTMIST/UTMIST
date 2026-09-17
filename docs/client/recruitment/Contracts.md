# Recruitment contracts and fixture adapters

Issue [#376](https://github.com/UTMIST/UTMIST/issues/376) establishes the
feature-owned contract used by candidate, reviewer, and scheduling UI. The
contract lives in `client/src/features/recruitment/types/contracts.ts`; the
representative in-memory implementation lives under
`client/src/features/recruitment/adapters/`.

Import the public barrels:

```ts
import {
  ApplicationStage,
  type RecruitmentAdapter,
} from "@/features/recruitment/types";
import { createFixtureRecruitmentAdapter } from "@/features/recruitment/adapters";
```

The fixture and eventual live implementation both implement
`RecruitmentAdapter`. UI code chooses between implementations at composition
time with `selectRecruitmentAdapter`; a feature flag is not an authorization
boundary. Live handlers still need `requireAdmin()` / `getAdminUser()` and
department scoping before they return applicant data.

## Identifiers and ownership

Identifiers are branded strings so TypeScript catches accidental mixing of a
posting ID, application ID, slot ID, or user ID. Use `recruitmentId(kind,
value)` at database and fixture boundaries.

A candidate, reviewer, and interviewer are roles played by the existing
`user` record. `CandidateId`, `ReviewerId`, and `InterviewerId` therefore all
use the same `UserId` identity; there is no separate candidate account and no
anonymous application method. A candidate becomes a candidate by submitting an
`ApplicationRecord` against a `Posting`.

Every `Posting` contains a `DepartmentSummary`. Reviewer reads and writes
require a reviewer ID and are limited to the departments on that reviewer's
profile. The fixture adapter enforces the same rule expected from the live
adapter.

## Shared stages and candidate visibility

`ApplicationStage` is the only internal workflow enum:

| Internal stage | Candidate view |
| --- | --- |
| `applied` | Received |
| `in_review` | Under review |
| `interview_scheduled` | Interview |
| `interviewed` | Interview |
| `accepted` | Decision: accepted |
| `rejected` | Decision: rejected |
| `waitlisted` | Under review |

`ALLOWED_STAGE_TRANSITIONS` is the central transition table. Scheduling uses
that table too: booking moves an application to `interview_scheduled`, while a
candidate cancellation returns it to `in_review`. Scheduling is not a second
workflow status.

Candidate UI receives `CandidateApplicationView`, which has no notes, stage
actors, reviewer identities, or internal waitlist value. Reviewer UI receives
`ReviewerApplicationView`, including attributed free-text notes and stage
history. There is intentionally no score or rubric field.

## Adapter errors

Adapters reject with `RecruitmentAdapterError`. Its stable `code` is one of:

- `authentication_required` — the live request has no account;
- `forbidden` — the account does not own the candidate record or department;
- `not_found` — an identifier is unknown within the caller's allowed scope;
- `validation` — submitted fields are missing or invalid;
- `conflict` — a duplicate application, invalid transition, or occupied slot;
- `unavailable` — a posting or dependency is not available;
- `unknown` — an unexpected live-adapter failure.

The optional `details.field` supports field-level form messages and
`details.retryable` tells UI whether retry copy is appropriate. Loading and
empty states remain UI state; an empty adapter list is not an error.

## Current-field mapping and proposed W1 fields

The deployed schema audit is tracked separately, so the adapters map the fields
visible in current code and make missing W1 fields explicit rather than
pretending they already exist.

| Existing source | Contract target | W1 treatment |
| --- | --- | --- |
| `user.id`, `email`, `name`, `year`, `resume_upload` | `CandidateProfile` | Reused through `userProfileToCandidate`; Platform sign-off is required before candidate profile persistence. |
| apply form `phone`, location, education | `CandidateProfile` extensions | Proposed candidate-owned profile fields; admin and department membership are deliberately absent from `CandidateProfileUpdate`. |
| Applicants `id` | `ApplicationRecord.id` | Reused as the application identifier. |
| Applicants `role` | `Posting.title` via posting relation | Replace the copied label with a `postingId` relationship. |
| Applicants `questions[]` | `ApplicationAnswer[]` | Add stable question IDs from the posting. |
| Applicants `applicationStatus` + `interviewStatus` | `ApplicationStage` | Normalize with `legacyStatusesToApplicationStage`; do not store a second workflow model. |
| Applicants `notes` | `ReviewerNote[]` | Replace the unattributed blob with notes carrying author and timestamps. No score or rubric. |
| Applicants candidate/job links and timestamps | `candidateId`, `postingId`, `submittedAt`, `updatedAt` | Required W1 relationships/metadata where missing. |
| Jobs title and department label | `Posting.title`, `Posting.department` | Preserve title; replace the department string with an owned department relationship. |
| Jobs scheduling and form metadata | posting status, open/close times, description, questions | Proposed W1 fields supplied to `legacyJobToPosting` until the live schema owns them. |

Legacy `Pending` plus `Scheduled` maps to `interview_scheduled`; `Pending` plus
`Finished` maps to `interviewed`; accept, reject, and waitlist take precedence.
Other existing `Pending` records map to `in_review` because they are already in
the reviewer queue. New submissions enter `applied` through the adapter.

## Fixture coverage and live integration

`createFixtureRecruitmentAdapter()` returns isolated mutable state on every
call. Its synthetic data covers multiple departments, an internal waitlist,
attributed notes, open availability, and an existing booking. It supports
candidate profile edits and submissions, reviewer filtering/detail/notes/stage
transitions, and interviewer availability plus candidate booking,
rescheduling, and cancellation.

The live candidate/posting adapter belongs to #378. Department-scoped reads,
application writes, reviewer notes, stage controls, and scheduling persistence
are integrated by their downstream W1 tasks. Those implementations must satisfy
the same `RecruitmentAdapter` interface, so UI built against fixtures does not
need to be rewritten.
