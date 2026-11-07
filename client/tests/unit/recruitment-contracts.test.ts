import {
  ApplicationStage,
  CandidateDecision,
  CandidateStage,
  InterviewBookingStatus,
  RecruitmentErrorCode,
  canTransitionApplicationStage,
  legacyStatusesToApplicationStage,
  recruitmentId,
  selectRecruitmentAdapter,
  toCandidateDecision,
  toCandidateStage,
} from "@/features/recruitment/types";
import { createFixtureRecruitmentAdapter } from "@/features/recruitment/adapters";

describe("recruitment contracts", () => {
  it.each([
    [ApplicationStage.Applied, CandidateStage.Received],
    [ApplicationStage.InReview, CandidateStage.UnderReview],
    [ApplicationStage.InterviewScheduled, CandidateStage.Interview],
    [ApplicationStage.Interviewed, CandidateStage.Interview],
    [ApplicationStage.Accepted, CandidateStage.Decision],
    [ApplicationStage.Rejected, CandidateStage.Decision],
    [ApplicationStage.Waitlisted, CandidateStage.UnderReview],
  ])("maps internal stage %s to candidate stage %s", (internal, candidate) => {
    expect(toCandidateStage(internal)).toBe(candidate);
  });

  it("only publishes accept and reject as candidate decisions", () => {
    expect(toCandidateDecision(ApplicationStage.Accepted)).toBe(
      CandidateDecision.Accepted,
    );
    expect(toCandidateDecision(ApplicationStage.Rejected)).toBe(
      CandidateDecision.Rejected,
    );
    expect(toCandidateDecision(ApplicationStage.Waitlisted)).toBeUndefined();
  });

  it("centralizes allowed stage transitions", () => {
    expect(
      canTransitionApplicationStage(
        ApplicationStage.InReview,
        ApplicationStage.InterviewScheduled,
      ),
    ).toBe(true);
    expect(
      canTransitionApplicationStage(
        ApplicationStage.Accepted,
        ApplicationStage.InReview,
      ),
    ).toBe(false);
  });

  it("reconciles legacy application and interview statuses", () => {
    expect(legacyStatusesToApplicationStage("Pending", "Scheduled")).toBe(
      ApplicationStage.InterviewScheduled,
    );
    expect(legacyStatusesToApplicationStage("Pending", "Finished")).toBe(
      ApplicationStage.Interviewed,
    );
    expect(legacyStatusesToApplicationStage("Waitlisted", "Finished")).toBe(
      ApplicationStage.Waitlisted,
    );
  });

  it("selects fixture and live implementations through the same seam", () => {
    const fixture = createFixtureRecruitmentAdapter();
    const live = createFixtureRecruitmentAdapter();
    expect(selectRecruitmentAdapter("fixture", { fixture, live })).toBe(fixture);
    expect(selectRecruitmentAdapter("live", { fixture, live })).toBe(live);
  });
});

describe("fixture recruitment adapter", () => {
  const aliceId = recruitmentId("user", "candidate-alice");
  const bobId = recruitmentId("user", "candidate-bob");
  const caseyId = recruitmentId("user", "candidate-casey");
  const engineeringReviewerId = recruitmentId(
    "user",
    "reviewer-engineering",
  );
  const engineeringApplicationId = recruitmentId(
    "application",
    "application-alice",
  );
  const academicsApplicationId = recruitmentId(
    "application",
    "application-bob",
  );
  const engineeringPostingId = recruitmentId(
    "posting",
    "platform-developer",
  );
  const academicsPostingId = recruitmentId(
    "posting",
    "workshop-developer",
  );
  const academicsQuestionId = recruitmentId(
    "question",
    "academics-motivation",
  );
  const engineeringOpenSlotId = recruitmentId(
    "availability-slot",
    "slot-engineering-open",
  );
  const caseyApplicationId = recruitmentId("application", "application-casey");
  const caseyBookingId = recruitmentId("booking", "booking-casey");
  const caseyScheduledSlotId = recruitmentId(
    "availability-slot",
    "slot-scheduled",
  );

  it("returns a candidate-safe view for an internal waitlist", async () => {
    const adapter = createFixtureRecruitmentAdapter();
    const [application] = await adapter.listCandidateApplications(bobId);

    expect(application.stage).toBe(CandidateStage.UnderReview);
    expect(application.decision).toBeUndefined();
    expect(application).not.toHaveProperty("notes");
    expect(application).not.toHaveProperty("stageHistory");
    expect(JSON.stringify(application)).not.toContain("reviewer-academics");
  });

  it("requires an existing candidate and a selected posting to apply", async () => {
    const adapter = createFixtureRecruitmentAdapter({
      now: () => new Date("2026-09-16T12:00:00.000Z"),
    });
    const application = await adapter.submitApplication({
      candidateId: aliceId,
      postingId: academicsPostingId,
      answers: [
        {
          questionId: academicsQuestionId,
          answer: "I would teach model evaluation with hands-on examples.",
        },
      ],
    });

    expect(application.stage).toBe(CandidateStage.Received);
    expect(application.posting.id).toBe(academicsPostingId);
    await expect(
      adapter.submitApplication({
        candidateId: aliceId,
        postingId: academicsPostingId,
        answers: [
          {
            questionId: academicsQuestionId,
            answer: "A duplicate application.",
          },
        ],
      }),
    ).rejects.toMatchObject({ code: RecruitmentErrorCode.Conflict });
  });

  it("enforces reviewer department ownership", async () => {
    const adapter = createFixtureRecruitmentAdapter();
    const applications = await adapter.listReviewerApplications({
      reviewerId: engineeringReviewerId,
    });

    expect(applications).toHaveLength(2);
    expect(
      applications.every(
        ({ posting }) => posting.id === engineeringPostingId,
      ),
    ).toBe(true);
    await expect(
      adapter.getReviewerApplication({
        reviewerId: engineeringReviewerId,
        applicationId: academicsApplicationId,
      }),
    ).rejects.toMatchObject({ code: RecruitmentErrorCode.Forbidden });
  });

  it("stores attributed free-text notes without a score", async () => {
    const adapter = createFixtureRecruitmentAdapter({
      now: () => new Date("2026-09-16T12:00:00.000Z"),
    });
    const note = await adapter.addReviewerNote({
      reviewerId: engineeringReviewerId,
      applicationId: engineeringApplicationId,
      body: "Clear examples and thoughtful trade-offs.",
    });

    expect(note.author.id).toBe(engineeringReviewerId);
    expect(note.createdAt).toBe("2026-09-16T12:00:00.000Z");
    expect(note).not.toHaveProperty("score");
    expect(note).not.toHaveProperty("rubric");
  });

  it("moves the shared stage when a candidate books and cancels", async () => {
    const adapter = createFixtureRecruitmentAdapter({
      now: () => new Date("2026-09-16T12:00:00.000Z"),
    });
    const booking = await adapter.bookInterview({
      candidateId: aliceId,
      applicationId: engineeringApplicationId,
      slotId: engineeringOpenSlotId,
    });

    expect(booking).not.toHaveProperty("interviewerId");
    const scheduled = await adapter.getReviewerApplication({
      reviewerId: engineeringReviewerId,
      applicationId: engineeringApplicationId,
    });
    expect(scheduled.application.stage).toBe(
      ApplicationStage.InterviewScheduled,
    );

    await adapter.cancelInterview({
      candidateId: aliceId,
      applicationId: engineeringApplicationId,
      bookingId: booking.id,
    });
    const cancelled = await adapter.getReviewerApplication({
      reviewerId: engineeringReviewerId,
      applicationId: engineeringApplicationId,
    });
    expect(cancelled.application.stage).toBe(ApplicationStage.InReview);
  });

  it("prevents a candidate from reading another candidate's slots", async () => {
    const adapter = createFixtureRecruitmentAdapter();
    await expect(
      adapter.listAvailability({
        candidateId: caseyId,
        applicationId: engineeringApplicationId,
      }),
    ).rejects.toMatchObject({ code: RecruitmentErrorCode.Forbidden });
  });

  it("releases an upcoming interview when an application is rejected", async () => {
    const adapter = createFixtureRecruitmentAdapter({
      now: () => new Date("2026-09-16T12:00:00.000Z"),
    });

    await adapter.transitionApplication({
      reviewerId: engineeringReviewerId,
      applicationId: caseyApplicationId,
      stage: ApplicationStage.Rejected,
    });

    const rejected = await adapter.getReviewerApplication({
      reviewerId: engineeringReviewerId,
      applicationId: caseyApplicationId,
    });
    expect(rejected.interview).toBeUndefined();

    const slots = await adapter.listAvailability({
      candidateId: aliceId,
      applicationId: engineeringApplicationId,
    });
    expect(slots.map((slot) => slot.id)).toContain(caseyScheduledSlotId);

    await expect(
      adapter.rescheduleInterview({
        candidateId: caseyId,
        applicationId: caseyApplicationId,
        bookingId: caseyBookingId,
        slotId: engineeringOpenSlotId,
      }),
    ).rejects.toMatchObject({ code: RecruitmentErrorCode.Conflict });
  });

  it("reserves the interview_scheduled transition for booking operations", async () => {
    const adapter = createFixtureRecruitmentAdapter({
      now: () => new Date("2026-09-16T12:00:00.000Z"),
    });
    const before = await adapter.getReviewerApplication({
      reviewerId: engineeringReviewerId,
      applicationId: engineeringApplicationId,
    });

    await expect(
      adapter.transitionApplication({
        reviewerId: engineeringReviewerId,
        applicationId: engineeringApplicationId,
        stage: ApplicationStage.InterviewScheduled,
      }),
    ).rejects.toMatchObject({ code: RecruitmentErrorCode.Validation });

    const after = await adapter.getReviewerApplication({
      reviewerId: engineeringReviewerId,
      applicationId: engineeringApplicationId,
    });
    expect(after.application.stage).toBe(ApplicationStage.InReview);
    expect(after.stageHistory).toHaveLength(before.stageHistory.length);

    const booking = await adapter.bookInterview({
      candidateId: aliceId,
      applicationId: engineeringApplicationId,
      slotId: engineeringOpenSlotId,
    });
    expect(booking.status).toBe(InterviewBookingStatus.Confirmed);

    const scheduled = await adapter.getReviewerApplication({
      reviewerId: engineeringReviewerId,
      applicationId: engineeringApplicationId,
    });
    expect(scheduled.application.stage).toBe(
      ApplicationStage.InterviewScheduled,
    );
  });

  it("never lists or books an interview slot whose start time has passed", async () => {
    const adapter = createFixtureRecruitmentAdapter({
      now: () => new Date("2026-10-10T12:00:00.000Z"),
    });

    await expect(
      adapter.listAvailability({
        candidateId: aliceId,
        applicationId: engineeringApplicationId,
      }),
    ).resolves.toHaveLength(0);

    await expect(
      adapter.bookInterview({
        candidateId: aliceId,
        applicationId: engineeringApplicationId,
        slotId: engineeringOpenSlotId,
      }),
    ).rejects.toMatchObject({ code: RecruitmentErrorCode.Conflict });
  });

  it("keeps the current booking when a reschedule target has expired", async () => {
    const adapter = createFixtureRecruitmentAdapter({
      now: () => new Date("2026-10-10T12:00:00.000Z"),
    });

    await expect(
      adapter.rescheduleInterview({
        candidateId: caseyId,
        applicationId: caseyApplicationId,
        bookingId: caseyBookingId,
        slotId: engineeringOpenSlotId,
      }),
    ).rejects.toMatchObject({ code: RecruitmentErrorCode.Conflict });

    const unchanged = await adapter.getReviewerApplication({
      reviewerId: engineeringReviewerId,
      applicationId: caseyApplicationId,
    });
    expect(unchanged.application.stage).toBe(
      ApplicationStage.InterviewScheduled,
    );
    expect(unchanged.interview?.id).toBe(caseyBookingId);
    expect(unchanged.interview?.slotId).toBe(caseyScheduledSlotId);
  });

  it("does not list or accept an application before the posting opens", async () => {
    const adapter = createFixtureRecruitmentAdapter({
      now: () => new Date("2026-08-01T12:00:00.000Z"),
    });

    await expect(adapter.listOpenPostings()).resolves.toHaveLength(0);
    await expect(
      adapter.submitApplication({
        candidateId: aliceId,
        postingId: academicsPostingId,
        answers: [
          { questionId: academicsQuestionId, answer: "Applying early." },
        ],
      }),
    ).rejects.toMatchObject({ code: RecruitmentErrorCode.Unavailable });
  });

  it.each([
    ["at the closing instant", "2027-01-15T04:59:59.000Z"],
    ["after closing", "2027-02-01T12:00:00.000Z"],
  ])(
    "does not list or accept an application %s",
    async (_label, instant) => {
      const adapter = createFixtureRecruitmentAdapter({
        now: () => new Date(instant),
      });

      await expect(adapter.listOpenPostings()).resolves.toHaveLength(0);
      await expect(
        adapter.submitApplication({
          candidateId: aliceId,
          postingId: academicsPostingId,
          answers: [
            { questionId: academicsQuestionId, answer: "Applying late." },
          ],
        }),
      ).rejects.toMatchObject({ code: RecruitmentErrorCode.Unavailable });
    },
  );

  it("rechecks the window when a posting closes between listing and submission", async () => {
    let clock = new Date("2026-09-16T12:00:00.000Z");
    const adapter = createFixtureRecruitmentAdapter({ now: () => clock });

    const listed = await adapter.listOpenPostings();
    expect(listed.map((posting) => posting.id)).toContain(academicsPostingId);

    clock = new Date("2027-02-01T12:00:00.000Z");
    await expect(
      adapter.submitApplication({
        candidateId: aliceId,
        postingId: academicsPostingId,
        answers: [
          {
            questionId: academicsQuestionId,
            answer: "Left the form open past the deadline.",
          },
        ],
      }),
    ).rejects.toMatchObject({ code: RecruitmentErrorCode.Unavailable });
  });
});
