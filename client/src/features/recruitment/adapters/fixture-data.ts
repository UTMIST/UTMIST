import {
  ApplicationStage,
  AvailabilitySlotStatus,
  InterviewBookingStatus,
  PostingStatus,
  recruitmentId,
  type ApplicationRecord,
  type AvailabilitySlot,
  type CandidateProfile,
  type DepartmentSummary,
  type InterviewBooking,
  type Posting,
  type ReviewerNote,
  type ReviewerProfile,
  type StageHistoryEntry,
} from "@/features/recruitment/types";

export interface RecruitmentFixtureSeed {
  candidates: readonly CandidateProfile[];
  departments: readonly DepartmentSummary[];
  postings: readonly Posting[];
  reviewers: readonly ReviewerProfile[];
  applications: readonly ApplicationRecord[];
  notes: readonly ReviewerNote[];
  stageHistory: Readonly<Record<string, readonly StageHistoryEntry[]>>;
  availability: readonly AvailabilitySlot[];
  bookings: readonly InterviewBooking[];
}

const engineeringId = recruitmentId("department", "engineering");
const academicsId = recruitmentId("department", "academics");
const candidateAliceId = recruitmentId("user", "candidate-alice");
const candidateBobId = recruitmentId("user", "candidate-bob");
const candidateCaseyId = recruitmentId("user", "candidate-casey");
const reviewerEngineeringId = recruitmentId("user", "reviewer-engineering");
const reviewerAcademicsId = recruitmentId("user", "reviewer-academics");
const engineeringPostingId = recruitmentId("posting", "platform-developer");
const academicsPostingId = recruitmentId("posting", "workshop-developer");
const engineeringQuestionId = recruitmentId("question", "engineering-motivation");
const academicsQuestionId = recruitmentId("question", "academics-motivation");
const aliceApplicationId = recruitmentId("application", "application-alice");
const bobApplicationId = recruitmentId("application", "application-bob");
const caseyApplicationId = recruitmentId("application", "application-casey");
const scheduledSlotId = recruitmentId("availability-slot", "slot-scheduled");

export const recruitmentFixtureSeed: RecruitmentFixtureSeed = {
  candidates: [
    {
      id: candidateAliceId,
      email: "alice.candidate@example.com",
      name: "Alice Candidate",
      phone: "416-555-0101",
      year: "3rd Year",
      education: {
        school: "University of Toronto",
        educationLevel: "Undergraduate",
        fieldOfStudy: "Computer Science",
        graduationMonth: "June",
        graduationYear: "2028",
      },
    },
    {
      id: candidateBobId,
      email: "bob.candidate@example.com",
      name: "Bob Candidate",
      year: "2nd Year",
    },
    {
      id: candidateCaseyId,
      email: "casey.candidate@example.com",
      name: "Casey Candidate",
      year: "4th Year",
    },
  ],
  departments: [
    { id: engineeringId, name: "Engineering" },
    { id: academicsId, name: "Academics" },
  ],
  postings: [
    {
      id: engineeringPostingId,
      department: { id: engineeringId, name: "Engineering" },
      title: "Platform Developer",
      summary: "Build reliable internal tools for UTMIST.",
      description: "Work on the website platform and recruitment tooling.",
      status: PostingStatus.Open,
      opensAt: "2026-09-01T13:00:00.000Z",
      closesAt: "2027-01-15T04:59:59.000Z",
      questions: [
        {
          id: engineeringQuestionId,
          prompt: "Why do you want to join Engineering?",
          required: true,
        },
      ],
    },
    {
      id: academicsPostingId,
      department: { id: academicsId, name: "Academics" },
      title: "Workshop Developer",
      summary: "Create practical machine-learning workshops.",
      description: "Design and deliver workshops for the UTMIST community.",
      status: PostingStatus.Open,
      opensAt: "2026-09-01T13:00:00.000Z",
      closesAt: "2027-01-15T04:59:59.000Z",
      questions: [
        {
          id: academicsQuestionId,
          prompt: "What would you like to teach?",
          required: true,
        },
      ],
    },
  ],
  reviewers: [
    {
      id: reviewerEngineeringId,
      name: "Evelyn Engineer",
      departmentIds: [engineeringId],
    },
    {
      id: reviewerAcademicsId,
      name: "Adrian Academic",
      departmentIds: [academicsId],
    },
  ],
  applications: [
    {
      id: aliceApplicationId,
      candidateId: candidateAliceId,
      postingId: engineeringPostingId,
      stage: ApplicationStage.InReview,
      answers: [
        {
          questionId: engineeringQuestionId,
          answer: "I want to make dependable tools that help every team.",
        },
      ],
      submittedAt: "2026-09-10T14:00:00.000Z",
      updatedAt: "2026-09-11T15:30:00.000Z",
    },
    {
      id: bobApplicationId,
      candidateId: candidateBobId,
      postingId: academicsPostingId,
      stage: ApplicationStage.Waitlisted,
      answers: [
        {
          questionId: academicsQuestionId,
          answer: "I would like to teach practical data visualization.",
        },
      ],
      submittedAt: "2026-09-09T16:00:00.000Z",
      updatedAt: "2026-09-12T12:00:00.000Z",
    },
    {
      id: caseyApplicationId,
      candidateId: candidateCaseyId,
      postingId: engineeringPostingId,
      stage: ApplicationStage.InterviewScheduled,
      answers: [
        {
          questionId: engineeringQuestionId,
          answer: "I enjoy making complex systems easier to operate.",
        },
      ],
      submittedAt: "2026-09-08T13:00:00.000Z",
      updatedAt: "2026-09-13T18:00:00.000Z",
    },
  ],
  notes: [
    {
      id: recruitmentId("note", "note-alice-1"),
      applicationId: aliceApplicationId,
      body: "Strong examples of collaborative debugging.",
      author: {
        id: reviewerEngineeringId,
        name: "Evelyn Engineer",
      },
      createdAt: "2026-09-11T15:30:00.000Z",
      updatedAt: "2026-09-11T15:30:00.000Z",
    },
  ],
  stageHistory: {
    [aliceApplicationId]: [
      {
        to: ApplicationStage.Applied,
        actorId: candidateAliceId,
        changedAt: "2026-09-10T14:00:00.000Z",
      },
      {
        from: ApplicationStage.Applied,
        to: ApplicationStage.InReview,
        actorId: reviewerEngineeringId,
        changedAt: "2026-09-11T15:30:00.000Z",
      },
    ],
    [bobApplicationId]: [
      {
        to: ApplicationStage.Applied,
        actorId: candidateBobId,
        changedAt: "2026-09-09T16:00:00.000Z",
      },
      {
        from: ApplicationStage.Applied,
        to: ApplicationStage.InReview,
        actorId: reviewerAcademicsId,
        changedAt: "2026-09-10T16:00:00.000Z",
      },
      {
        from: ApplicationStage.InReview,
        to: ApplicationStage.Waitlisted,
        actorId: reviewerAcademicsId,
        changedAt: "2026-09-12T12:00:00.000Z",
      },
    ],
    [caseyApplicationId]: [
      {
        to: ApplicationStage.Applied,
        actorId: candidateCaseyId,
        changedAt: "2026-09-08T13:00:00.000Z",
      },
      {
        from: ApplicationStage.Applied,
        to: ApplicationStage.InReview,
        actorId: reviewerEngineeringId,
        changedAt: "2026-09-09T13:00:00.000Z",
      },
      {
        from: ApplicationStage.InReview,
        to: ApplicationStage.InterviewScheduled,
        actorId: candidateCaseyId,
        changedAt: "2026-09-13T18:00:00.000Z",
      },
    ],
  },
  availability: [
    {
      id: recruitmentId("availability-slot", "slot-engineering-open"),
      departmentId: engineeringId,
      interviewerId: reviewerEngineeringId,
      startsAt: "2026-10-01T18:00:00.000Z",
      endsAt: "2026-10-01T18:30:00.000Z",
      timeZone: "America/Toronto",
      status: AvailabilitySlotStatus.Available,
    },
    {
      id: scheduledSlotId,
      departmentId: engineeringId,
      interviewerId: reviewerEngineeringId,
      startsAt: "2026-09-24T18:00:00.000Z",
      endsAt: "2026-09-24T18:30:00.000Z",
      timeZone: "America/Toronto",
      status: AvailabilitySlotStatus.Booked,
    },
    {
      id: recruitmentId("availability-slot", "slot-academics-open"),
      departmentId: academicsId,
      interviewerId: reviewerAcademicsId,
      startsAt: "2026-10-02T17:00:00.000Z",
      endsAt: "2026-10-02T17:30:00.000Z",
      timeZone: "America/Toronto",
      status: AvailabilitySlotStatus.Available,
    },
  ],
  bookings: [
    {
      id: recruitmentId("booking", "booking-casey"),
      applicationId: caseyApplicationId,
      slotId: scheduledSlotId,
      interviewerId: reviewerEngineeringId,
      startsAt: "2026-09-24T18:00:00.000Z",
      endsAt: "2026-09-24T18:30:00.000Z",
      timeZone: "America/Toronto",
      status: InterviewBookingStatus.Confirmed,
    },
  ],
};
