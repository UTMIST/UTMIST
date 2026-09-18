import {
  ApplicationStage,
  AvailabilitySlotStatus,
  CANDIDATE_STAGE_LABELS,
  InterviewBookingStatus,
  PostingStatus,
  RecruitmentAdapterError,
  RecruitmentErrorCode,
  canTransitionApplicationStage,
  recruitmentId,
  toCandidateDecision,
  toCandidateStage,
  type AddReviewerNoteInput,
  type ApplicationId,
  type ApplicationRecord,
  type AvailabilityQuery,
  type AvailabilitySlot,
  type BookInterviewInput,
  type CancelInterviewInput,
  type CandidateApplicationView,
  type CandidateId,
  type CandidateInterviewBooking,
  type CandidateProfile,
  type CandidateProfileUpdate,
  type InterviewBooking,
  type Posting,
  type PostingId,
  type PublishAvailabilityInput,
  type RecruitmentAdapter,
  type RescheduleInterviewInput,
  type ReviewerApplicationInput,
  type ReviewerApplicationQuery,
  type ReviewerApplicationView,
  type ReviewerId,
  type ReviewerNote,
  type ReviewerProfile,
  type StageHistoryEntry,
  type SubmitApplicationInput,
  type TransitionApplicationInput,
  type UserId,
} from "@/features/recruitment/types";
import {
  recruitmentFixtureSeed,
  type RecruitmentFixtureSeed,
} from "@/features/recruitment/adapters/fixture-data";

const clone = <Value>(value: Value): Value =>
  JSON.parse(JSON.stringify(value)) as Value;

export interface FixtureRecruitmentAdapterOptions {
  seed?: RecruitmentFixtureSeed;
  now?: () => Date;
}

export class FixtureRecruitmentAdapter implements RecruitmentAdapter {
  private readonly candidates: CandidateProfile[];
  private readonly postings: Posting[];
  private readonly reviewers: ReviewerProfile[];
  private readonly applications: ApplicationRecord[];
  private readonly notes: ReviewerNote[];
  private readonly stageHistory: Record<string, StageHistoryEntry[]>;
  private readonly availability: AvailabilitySlot[];
  private readonly bookings: InterviewBooking[];
  private readonly now: () => Date;
  private sequence = 0;

  constructor(options: FixtureRecruitmentAdapterOptions = {}) {
    const seed = options.seed ?? recruitmentFixtureSeed;
    this.candidates = seed.candidates.map(clone);
    this.postings = seed.postings.map(clone);
    this.reviewers = seed.reviewers.map(clone);
    this.applications = seed.applications.map(clone);
    this.notes = seed.notes.map(clone);
    this.stageHistory = Object.fromEntries(
      Object.entries(seed.stageHistory).map(([id, entries]) => [
        id,
        entries.map(clone),
      ]),
    );
    this.availability = seed.availability.map(clone);
    this.bookings = seed.bookings.map(clone);
    this.now = options.now ?? (() => new Date());
  }

  async getCandidate(candidateId: CandidateId): Promise<CandidateProfile> {
    return clone(this.requireCandidate(candidateId));
  }

  async updateCandidate(
    candidateId: CandidateId,
    update: CandidateProfileUpdate,
  ): Promise<CandidateProfile> {
    const candidate = this.requireCandidate(candidateId);
    if (update.name !== undefined && !update.name.trim()) {
      throw new RecruitmentAdapterError(
        RecruitmentErrorCode.Validation,
        "Candidate name cannot be empty",
        { field: "name" },
      );
    }

    Object.assign(candidate, clone(update));
    return clone(candidate);
  }

  async listOpenPostings(): Promise<readonly Posting[]> {
    return clone(
      this.postings.filter((posting) => posting.status === PostingStatus.Open),
    );
  }

  async getPosting(postingId: PostingId): Promise<Posting> {
    return clone(this.requirePosting(postingId));
  }

  async submitApplication(
    input: SubmitApplicationInput,
  ): Promise<CandidateApplicationView> {
    this.requireCandidate(input.candidateId);
    const posting = this.requirePosting(input.postingId);

    if (posting.status !== PostingStatus.Open) {
      throw new RecruitmentAdapterError(
        RecruitmentErrorCode.Unavailable,
        "This posting is not accepting applications",
      );
    }

    if (
      this.applications.some(
        (application) =>
          application.candidateId === input.candidateId &&
          application.postingId === input.postingId,
      )
    ) {
      throw new RecruitmentAdapterError(
        RecruitmentErrorCode.Conflict,
        "The candidate has already applied to this posting",
      );
    }

    for (const question of posting.questions) {
      const answer = input.answers.find(
        (candidateAnswer) => candidateAnswer.questionId === question.id,
      );
      if (question.required && !answer?.answer.trim()) {
        throw new RecruitmentAdapterError(
          RecruitmentErrorCode.Validation,
          `A response is required for: ${question.prompt}`,
          { field: `answers.${question.id}` },
        );
      }
    }

    const timestamp = this.timestamp();
    const application: ApplicationRecord = {
      id: recruitmentId("application", this.nextId("application")),
      candidateId: input.candidateId,
      postingId: input.postingId,
      stage: ApplicationStage.Applied,
      answers: clone(input.answers),
      submittedAt: timestamp,
      updatedAt: timestamp,
    };
    this.applications.push(application);
    this.stageHistory[application.id] = [
      {
        to: ApplicationStage.Applied,
        actorId: input.candidateId,
        changedAt: timestamp,
      },
    ];

    return this.candidateView(application);
  }

  async listCandidateApplications(
    candidateId: CandidateId,
  ): Promise<readonly CandidateApplicationView[]> {
    this.requireCandidate(candidateId);
    return this.applications
      .filter((application) => application.candidateId === candidateId)
      .map((application) => this.candidateView(application));
  }

  async listReviewerApplications(
    query: ReviewerApplicationQuery,
  ): Promise<readonly ReviewerApplicationView[]> {
    const reviewer = this.requireReviewer(query.reviewerId);
    if (
      query.departmentId &&
      !reviewer.departmentIds.includes(query.departmentId)
    ) {
      throw this.forbidden();
    }

    const search = query.search?.trim().toLowerCase();
    return this.applications
      .filter((application) => {
        const posting = this.requirePosting(application.postingId);
        const candidate = this.requireCandidate(application.candidateId);
        return (
          reviewer.departmentIds.includes(posting.department.id) &&
          (!query.departmentId ||
            posting.department.id === query.departmentId) &&
          (!query.postingId || posting.id === query.postingId) &&
          (!query.stages?.length || query.stages.includes(application.stage)) &&
          (!search ||
            candidate.name.toLowerCase().includes(search) ||
            candidate.email.toLowerCase().includes(search) ||
            posting.title.toLowerCase().includes(search))
        );
      })
      .map((application) => this.reviewerView(application));
  }

  async getReviewerApplication(
    input: ReviewerApplicationInput,
  ): Promise<ReviewerApplicationView> {
    const application = this.requireApplication(input.applicationId);
    this.assertReviewerAccess(input.reviewerId, application);
    return this.reviewerView(application);
  }

  async addReviewerNote(input: AddReviewerNoteInput): Promise<ReviewerNote> {
    const application = this.requireApplication(input.applicationId);
    const reviewer = this.assertReviewerAccess(input.reviewerId, application);
    if (!input.body.trim()) {
      throw new RecruitmentAdapterError(
        RecruitmentErrorCode.Validation,
        "Reviewer notes cannot be empty",
        { field: "body" },
      );
    }

    const timestamp = this.timestamp();
    const note: ReviewerNote = {
      id: recruitmentId("note", this.nextId("note")),
      applicationId: application.id,
      body: input.body.trim(),
      author: { id: reviewer.id, name: reviewer.name },
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.notes.push(note);
    return clone(note);
  }

  async transitionApplication(
    input: TransitionApplicationInput,
  ): Promise<ReviewerApplicationView> {
    const application = this.requireApplication(input.applicationId);
    this.assertReviewerAccess(input.reviewerId, application);
    this.moveApplication(application, input.stage, input.reviewerId);
    return this.reviewerView(application);
  }

  async listAvailability(
    query: AvailabilityQuery,
  ): Promise<readonly AvailabilitySlot[]> {
    const application = this.assertCandidateApplication(query);
    const posting = this.requirePosting(application.postingId);
    return clone(
      this.availability.filter(
        (slot) =>
          slot.departmentId === posting.department.id &&
          slot.status === AvailabilitySlotStatus.Available,
      ),
    );
  }

  async publishAvailability(
    input: PublishAvailabilityInput,
  ): Promise<AvailabilitySlot> {
    const interviewer = this.requireReviewer(input.interviewerId);
    if (!interviewer.departmentIds.includes(input.departmentId)) {
      throw this.forbidden();
    }

    const startsAt = Date.parse(input.startsAt);
    const endsAt = Date.parse(input.endsAt);
    if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || startsAt >= endsAt) {
      throw new RecruitmentAdapterError(
        RecruitmentErrorCode.Validation,
        "Availability must have a valid start before its end",
        { field: "startsAt" },
      );
    }

    const overlaps = this.availability.some(
      (slot) =>
        slot.interviewerId === input.interviewerId &&
        startsAt < Date.parse(slot.endsAt) &&
        endsAt > Date.parse(slot.startsAt),
    );
    if (overlaps) {
      throw new RecruitmentAdapterError(
        RecruitmentErrorCode.Conflict,
        "This availability overlaps an existing slot",
      );
    }

    const slot: AvailabilitySlot = {
      id: recruitmentId("availability-slot", this.nextId("slot")),
      ...input,
      status: AvailabilitySlotStatus.Available,
    };
    this.availability.push(slot);
    return clone(slot);
  }

  async bookInterview(
    input: BookInterviewInput,
  ): Promise<CandidateInterviewBooking> {
    const application = this.assertCandidateApplication(input);
    const posting = this.requirePosting(application.postingId);
    const slot = this.requireAvailableSlot(input.slotId, posting.department.id);
    if (
      this.bookings.some(
        (booking) =>
          booking.applicationId === application.id &&
          booking.status === InterviewBookingStatus.Confirmed,
      )
    ) {
      throw new RecruitmentAdapterError(
        RecruitmentErrorCode.Conflict,
        "This application already has an interview booking",
      );
    }

    this.moveApplication(
      application,
      ApplicationStage.InterviewScheduled,
      input.candidateId,
    );
    slot.status = AvailabilitySlotStatus.Booked;
    const booking: InterviewBooking = {
      id: recruitmentId("booking", this.nextId("booking")),
      applicationId: application.id,
      slotId: slot.id,
      interviewerId: slot.interviewerId,
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
      timeZone: slot.timeZone,
      status: InterviewBookingStatus.Confirmed,
    };
    this.bookings.push(booking);
    return this.candidateBooking(booking);
  }

  async rescheduleInterview(
    input: RescheduleInterviewInput,
  ): Promise<CandidateInterviewBooking> {
    const application = this.assertCandidateApplication(input);
    const posting = this.requirePosting(application.postingId);
    const booking = this.requireCandidateBooking(
      input.bookingId,
      application.id,
    );
    const newSlot = this.requireAvailableSlot(
      input.slotId,
      posting.department.id,
    );
    const oldSlot = this.requireSlot(booking.slotId);

    oldSlot.status = AvailabilitySlotStatus.Available;
    newSlot.status = AvailabilitySlotStatus.Booked;
    booking.slotId = newSlot.id;
    booking.interviewerId = newSlot.interviewerId;
    booking.startsAt = newSlot.startsAt;
    booking.endsAt = newSlot.endsAt;
    booking.timeZone = newSlot.timeZone;
    application.updatedAt = this.timestamp();
    return this.candidateBooking(booking);
  }

  async cancelInterview(
    input: CancelInterviewInput,
  ): Promise<CandidateInterviewBooking> {
    const application = this.assertCandidateApplication(input);
    const booking = this.requireCandidateBooking(
      input.bookingId,
      application.id,
    );
    const slot = this.requireSlot(booking.slotId);

    this.moveApplication(application, ApplicationStage.InReview, input.candidateId);
    slot.status = AvailabilitySlotStatus.Available;
    booking.status = InterviewBookingStatus.Cancelled;
    return this.candidateBooking(booking);
  }

  private candidateView(
    application: ApplicationRecord,
  ): CandidateApplicationView {
    const stage = toCandidateStage(application.stage);
    const interview = this.bookings.find(
      (booking) =>
        booking.applicationId === application.id &&
        booking.status === InterviewBookingStatus.Confirmed,
    );

    return clone({
      id: application.id,
      posting: this.requirePosting(application.postingId),
      stage,
      stageLabel: CANDIDATE_STAGE_LABELS[stage],
      decision: toCandidateDecision(application.stage),
      submittedAt: application.submittedAt,
      updatedAt: application.updatedAt,
      interview: interview ? this.candidateBooking(interview) : undefined,
    });
  }

  private reviewerView(application: ApplicationRecord): ReviewerApplicationView {
    const booking = this.bookings.find(
      (candidateBooking) =>
        candidateBooking.applicationId === application.id &&
        candidateBooking.status === InterviewBookingStatus.Confirmed,
    );
    return clone({
      application,
      candidate: this.requireCandidate(application.candidateId),
      posting: this.requirePosting(application.postingId),
      notes: this.notes.filter(
        (note) => note.applicationId === application.id,
      ),
      stageHistory: this.stageHistory[application.id] ?? [],
      interview: booking,
    });
  }

  private candidateBooking(
    booking: InterviewBooking,
  ): CandidateInterviewBooking {
    return clone({
      id: booking.id,
      applicationId: booking.applicationId,
      slotId: booking.slotId,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      timeZone: booking.timeZone,
      status: booking.status,
    });
  }

  private assertCandidateApplication(query: AvailabilityQuery): ApplicationRecord {
    const application = this.requireApplication(query.applicationId);
    if (application.candidateId !== query.candidateId) {
      throw this.forbidden();
    }
    return application;
  }

  private assertReviewerAccess(
    reviewerId: ReviewerId,
    application: ApplicationRecord,
  ): ReviewerProfile {
    const reviewer = this.requireReviewer(reviewerId);
    const posting = this.requirePosting(application.postingId);
    if (!reviewer.departmentIds.includes(posting.department.id)) {
      throw this.forbidden();
    }
    return reviewer;
  }

  private moveApplication(
    application: ApplicationRecord,
    stage: ApplicationStage,
    actorId: UserId,
  ): void {
    if (!canTransitionApplicationStage(application.stage, stage)) {
      throw new RecruitmentAdapterError(
        RecruitmentErrorCode.Conflict,
        `Cannot move an application from ${application.stage} to ${stage}`,
      );
    }

    const timestamp = this.timestamp();
    const previousStage = application.stage;
    application.stage = stage;
    application.updatedAt = timestamp;
    const history = this.stageHistory[application.id] ?? [];
    history.push({
      from: previousStage,
      to: stage,
      actorId,
      changedAt: timestamp,
    });
    this.stageHistory[application.id] = history;
  }

  private requireCandidate(candidateId: CandidateId): CandidateProfile {
    const candidate = this.candidates.find((item) => item.id === candidateId);
    if (!candidate) {
      throw this.notFound("Candidate");
    }
    return candidate;
  }

  private requirePosting(postingId: PostingId): Posting {
    const posting = this.postings.find((item) => item.id === postingId);
    if (!posting) {
      throw this.notFound("Posting");
    }
    return posting;
  }

  private requireReviewer(reviewerId: ReviewerId): ReviewerProfile {
    const reviewer = this.reviewers.find((item) => item.id === reviewerId);
    if (!reviewer) {
      throw this.notFound("Reviewer");
    }
    return reviewer;
  }

  private requireApplication(applicationId: ApplicationId): ApplicationRecord {
    const application = this.applications.find(
      (item) => item.id === applicationId,
    );
    if (!application) {
      throw this.notFound("Application");
    }
    return application;
  }

  private requireSlot(slotId: AvailabilitySlot["id"]): AvailabilitySlot {
    const slot = this.availability.find((item) => item.id === slotId);
    if (!slot) {
      throw this.notFound("Availability slot");
    }
    return slot;
  }

  private requireAvailableSlot(
    slotId: AvailabilitySlot["id"],
    departmentId: AvailabilitySlot["departmentId"],
  ): AvailabilitySlot {
    const slot = this.requireSlot(slotId);
    if (
      slot.departmentId !== departmentId ||
      slot.status !== AvailabilitySlotStatus.Available
    ) {
      throw new RecruitmentAdapterError(
        RecruitmentErrorCode.Conflict,
        "This interview slot is no longer available",
      );
    }
    return slot;
  }

  private requireCandidateBooking(
    bookingId: InterviewBooking["id"],
    applicationId: ApplicationId,
  ): InterviewBooking {
    const booking = this.bookings.find(
      (item) =>
        item.id === bookingId &&
        item.applicationId === applicationId &&
        item.status === InterviewBookingStatus.Confirmed,
    );
    if (!booking) {
      throw this.notFound("Interview booking");
    }
    return booking;
  }

  private forbidden(): RecruitmentAdapterError {
    return new RecruitmentAdapterError(
      RecruitmentErrorCode.Forbidden,
      "This user cannot access the requested recruitment record",
    );
  }

  private notFound(entity: string): RecruitmentAdapterError {
    return new RecruitmentAdapterError(
      RecruitmentErrorCode.NotFound,
      `${entity} was not found`,
    );
  }

  private timestamp(): string {
    return this.now().toISOString();
  }

  private nextId(prefix: string): string {
    this.sequence += 1;
    return `fixture-${prefix}-${this.sequence}`;
  }
}

export function createFixtureRecruitmentAdapter(
  options?: FixtureRecruitmentAdapterOptions,
): RecruitmentAdapter {
  return new FixtureRecruitmentAdapter(options);
}
