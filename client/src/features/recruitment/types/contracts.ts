/**
 * Stable, feature-owned contract for recruitment UIs and data adapters.
 *
 * The contract deliberately exposes separate candidate and reviewer views.
 * Candidate views cannot contain reviewer identities or internal notes.
 */

declare const recruitmentIdBrand: unique symbol;

export type RecruitmentEntity =
  | "application"
  | "availability-slot"
  | "booking"
  | "department"
  | "note"
  | "posting"
  | "question"
  | "user";

export type RecruitmentId<Entity extends RecruitmentEntity> = string & {
  readonly [recruitmentIdBrand]: Entity;
};

export type UserId = RecruitmentId<"user">;
export type CandidateId = UserId;
export type ReviewerId = UserId;
export type InterviewerId = UserId;
export type DepartmentId = RecruitmentId<"department">;
export type PostingId = RecruitmentId<"posting">;
export type ApplicationId = RecruitmentId<"application">;
export type QuestionId = RecruitmentId<"question">;
export type ReviewerNoteId = RecruitmentId<"note">;
export type AvailabilitySlotId = RecruitmentId<"availability-slot">;
export type InterviewBookingId = RecruitmentId<"booking">;
export type IsoDateTime = string;

export function recruitmentId<Entity extends RecruitmentEntity>(
  entity: Entity,
  value: string,
): RecruitmentId<Entity> {
  if (!value.trim()) {
    throw new RecruitmentAdapterError(
      RecruitmentErrorCode.Validation,
      `${entity} identifiers cannot be empty`,
      { field: "id" },
    );
  }

  return value as RecruitmentId<Entity>;
}

export enum ApplicationStage {
  Applied = "applied",
  InReview = "in_review",
  InterviewScheduled = "interview_scheduled",
  Interviewed = "interviewed",
  Accepted = "accepted",
  Rejected = "rejected",
  Waitlisted = "waitlisted",
}

export enum CandidateStage {
  Received = "received",
  UnderReview = "under_review",
  Interview = "interview",
  Decision = "decision",
}

export enum CandidateDecision {
  Accepted = "accepted",
  Rejected = "rejected",
}

export const APPLICATION_STAGES = Object.values(ApplicationStage);

export const CANDIDATE_STAGE_LABELS: Readonly<Record<CandidateStage, string>> = {
  [CandidateStage.Received]: "Received",
  [CandidateStage.UnderReview]: "Under review",
  [CandidateStage.Interview]: "Interview",
  [CandidateStage.Decision]: "Decision",
};

export const CANDIDATE_STAGE_BY_APPLICATION_STAGE: Readonly<
  Record<ApplicationStage, CandidateStage>
> = {
  [ApplicationStage.Applied]: CandidateStage.Received,
  [ApplicationStage.InReview]: CandidateStage.UnderReview,
  [ApplicationStage.InterviewScheduled]: CandidateStage.Interview,
  [ApplicationStage.Interviewed]: CandidateStage.Interview,
  [ApplicationStage.Accepted]: CandidateStage.Decision,
  [ApplicationStage.Rejected]: CandidateStage.Decision,
  [ApplicationStage.Waitlisted]: CandidateStage.UnderReview,
};

export const ALLOWED_STAGE_TRANSITIONS: Readonly<
  Record<ApplicationStage, readonly ApplicationStage[]>
> = {
  [ApplicationStage.Applied]: [
    ApplicationStage.InReview,
    ApplicationStage.Rejected,
  ],
  [ApplicationStage.InReview]: [
    ApplicationStage.InterviewScheduled,
    ApplicationStage.Accepted,
    ApplicationStage.Rejected,
    ApplicationStage.Waitlisted,
  ],
  [ApplicationStage.InterviewScheduled]: [
    ApplicationStage.InReview,
    ApplicationStage.Interviewed,
    ApplicationStage.Rejected,
    ApplicationStage.Waitlisted,
  ],
  [ApplicationStage.Interviewed]: [
    ApplicationStage.Accepted,
    ApplicationStage.Rejected,
    ApplicationStage.Waitlisted,
  ],
  [ApplicationStage.Accepted]: [],
  [ApplicationStage.Rejected]: [],
  [ApplicationStage.Waitlisted]: [
    ApplicationStage.InReview,
    ApplicationStage.InterviewScheduled,
    ApplicationStage.Accepted,
    ApplicationStage.Rejected,
  ],
};

export function toCandidateStage(stage: ApplicationStage): CandidateStage {
  return CANDIDATE_STAGE_BY_APPLICATION_STAGE[stage];
}

export function toCandidateDecision(
  stage: ApplicationStage,
): CandidateDecision | undefined {
  if (stage === ApplicationStage.Accepted) {
    return CandidateDecision.Accepted;
  }

  if (stage === ApplicationStage.Rejected) {
    return CandidateDecision.Rejected;
  }

  return undefined;
}

export function canTransitionApplicationStage(
  from: ApplicationStage,
  to: ApplicationStage,
): boolean {
  return ALLOWED_STAGE_TRANSITIONS[from].includes(to);
}

export enum RecruitmentErrorCode {
  AuthenticationRequired = "authentication_required",
  Forbidden = "forbidden",
  NotFound = "not_found",
  Validation = "validation",
  Conflict = "conflict",
  Unavailable = "unavailable",
  Unknown = "unknown",
}

export interface RecruitmentErrorDetails {
  field?: string;
  retryable?: boolean;
}

export class RecruitmentAdapterError extends Error {
  readonly name = "RecruitmentAdapterError";

  constructor(
    readonly code: RecruitmentErrorCode,
    message: string,
    readonly details: RecruitmentErrorDetails = {},
  ) {
    super(message);
  }
}

export interface CandidateLocation {
  country: string;
  address: string;
  city: string;
  postalCode: string;
  provinceOrState: string;
}

export interface CandidateEducation {
  school: string;
  educationLevel: string;
  fieldOfStudy: string;
  graduationMonth: string;
  graduationYear: string;
}

/** A candidate is an existing user profile, not a second identity record. */
export interface CandidateProfile {
  id: CandidateId;
  email: string;
  name: string;
  phone?: string;
  year?: string;
  location?: CandidateLocation;
  education?: CandidateEducation;
  resumeUploadedAt?: IsoDateTime;
}

/** Explicitly excludes admin and department-membership fields. */
export type CandidateProfileUpdate = Partial<
  Pick<CandidateProfile, "name" | "phone" | "year" | "location" | "education">
>;

export interface DepartmentSummary {
  id: DepartmentId;
  name: string;
}

export enum PostingStatus {
  Draft = "draft",
  Open = "open",
  Closed = "closed",
}

export interface ApplicationQuestion {
  id: QuestionId;
  prompt: string;
  required: boolean;
}

export interface Posting {
  id: PostingId;
  department: DepartmentSummary;
  title: string;
  summary: string;
  description: string;
  status: PostingStatus;
  opensAt: IsoDateTime;
  closesAt: IsoDateTime;
  questions: readonly ApplicationQuestion[];
}

export interface ApplicationAnswer {
  questionId: QuestionId;
  answer: string;
}

export interface ApplicationRecord {
  id: ApplicationId;
  candidateId: CandidateId;
  postingId: PostingId;
  stage: ApplicationStage;
  answers: readonly ApplicationAnswer[];
  submittedAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface StageHistoryEntry {
  from?: ApplicationStage;
  to: ApplicationStage;
  actorId: UserId;
  changedAt: IsoDateTime;
}

export interface ReviewerSummary {
  id: ReviewerId;
  name: string;
}

export interface ReviewerProfile extends ReviewerSummary {
  departmentIds: readonly DepartmentId[];
}

export interface ReviewerNote {
  id: ReviewerNoteId;
  applicationId: ApplicationId;
  body: string;
  author: ReviewerSummary;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export enum AvailabilitySlotStatus {
  Available = "available",
  Booked = "booked",
}

export interface AvailabilitySlot {
  id: AvailabilitySlotId;
  departmentId: DepartmentId;
  interviewerId: InterviewerId;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  timeZone: string;
  status: AvailabilitySlotStatus;
}

export enum InterviewBookingStatus {
  Confirmed = "confirmed",
  Cancelled = "cancelled",
}

export interface InterviewBooking {
  id: InterviewBookingId;
  applicationId: ApplicationId;
  slotId: AvailabilitySlotId;
  interviewerId: InterviewerId;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  timeZone: string;
  status: InterviewBookingStatus;
}

/** Candidate-safe booking view; interviewer identity stays internal. */
export type CandidateInterviewBooking = Omit<InterviewBooking, "interviewerId">;

/**
 * Candidate-safe application view. It cannot expose notes, stage actors,
 * reviewer identities, or the internal waitlisted state.
 */
export interface CandidateApplicationView {
  id: ApplicationId;
  posting: Posting;
  stage: CandidateStage;
  stageLabel: string;
  decision?: CandidateDecision;
  submittedAt: IsoDateTime;
  updatedAt: IsoDateTime;
  interview?: CandidateInterviewBooking;
}

export interface ReviewerApplicationView {
  application: ApplicationRecord;
  candidate: CandidateProfile;
  posting: Posting;
  notes: readonly ReviewerNote[];
  stageHistory: readonly StageHistoryEntry[];
  interview?: InterviewBooking;
}

export interface SubmitApplicationInput {
  candidateId: CandidateId;
  postingId: PostingId;
  answers: readonly ApplicationAnswer[];
}

export interface ReviewerApplicationQuery {
  reviewerId: ReviewerId;
  departmentId?: DepartmentId;
  postingId?: PostingId;
  stages?: readonly ApplicationStage[];
  search?: string;
}

export interface ReviewerApplicationInput {
  reviewerId: ReviewerId;
  applicationId: ApplicationId;
}

export interface AddReviewerNoteInput extends ReviewerApplicationInput {
  body: string;
}

export interface TransitionApplicationInput extends ReviewerApplicationInput {
  stage: ApplicationStage;
}

export interface AvailabilityQuery {
  candidateId: CandidateId;
  applicationId: ApplicationId;
}

export interface PublishAvailabilityInput {
  interviewerId: InterviewerId;
  departmentId: DepartmentId;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  timeZone: string;
}

export interface BookInterviewInput extends AvailabilityQuery {
  slotId: AvailabilitySlotId;
}

export interface RescheduleInterviewInput extends BookInterviewInput {
  bookingId: InterviewBookingId;
}

export interface CancelInterviewInput extends AvailabilityQuery {
  bookingId: InterviewBookingId;
}

export interface RecruitmentAdapter {
  getCandidate(candidateId: CandidateId): Promise<CandidateProfile>;
  updateCandidate(
    candidateId: CandidateId,
    update: CandidateProfileUpdate,
  ): Promise<CandidateProfile>;
  listOpenPostings(): Promise<readonly Posting[]>;
  getPosting(postingId: PostingId): Promise<Posting>;
  submitApplication(
    input: SubmitApplicationInput,
  ): Promise<CandidateApplicationView>;
  listCandidateApplications(
    candidateId: CandidateId,
  ): Promise<readonly CandidateApplicationView[]>;
  listReviewerApplications(
    query: ReviewerApplicationQuery,
  ): Promise<readonly ReviewerApplicationView[]>;
  getReviewerApplication(
    input: ReviewerApplicationInput,
  ): Promise<ReviewerApplicationView>;
  addReviewerNote(input: AddReviewerNoteInput): Promise<ReviewerNote>;
  transitionApplication(
    input: TransitionApplicationInput,
  ): Promise<ReviewerApplicationView>;
  listAvailability(
    query: AvailabilityQuery,
  ): Promise<readonly AvailabilitySlot[]>;
  publishAvailability(
    input: PublishAvailabilityInput,
  ): Promise<AvailabilitySlot>;
  bookInterview(input: BookInterviewInput): Promise<CandidateInterviewBooking>;
  rescheduleInterview(
    input: RescheduleInterviewInput,
  ): Promise<CandidateInterviewBooking>;
  cancelInterview(
    input: CancelInterviewInput,
  ): Promise<CandidateInterviewBooking>;
}

export type RecruitmentAdapterMode = "fixture" | "live";

export interface RecruitmentAdapterRegistry {
  fixture: RecruitmentAdapter;
  live: RecruitmentAdapter;
}

export function selectRecruitmentAdapter(
  mode: RecruitmentAdapterMode,
  adapters: RecruitmentAdapterRegistry,
): RecruitmentAdapter {
  return adapters[mode];
}
