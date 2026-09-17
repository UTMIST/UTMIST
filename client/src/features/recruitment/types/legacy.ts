import type { UserProfile } from "@/shared/lib";
import {
  ApplicationStage,
  PostingStatus,
  type ApplicationQuestion,
  type CandidateEducation,
  type CandidateLocation,
  type CandidateProfile,
  type DepartmentSummary,
  type IsoDateTime,
  type Posting,
  type PostingId,
  recruitmentId,
} from "@/features/recruitment/types/contracts";

export enum LegacyApplicationStatus {
  Pending = "Pending",
  Waitlisted = "Waitlisted",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

export enum LegacyInterviewStatus {
  NotScheduled = "Not Scheduled",
  Pending = "Pending",
  Scheduled = "Scheduled",
  Finished = "Finished",
}

export interface CandidateProfileExtensions {
  phone?: string;
  location?: CandidateLocation;
  education?: CandidateEducation;
}

export function userProfileToCandidate(
  user: UserProfile,
  extensions: CandidateProfileExtensions = {},
): CandidateProfile {
  return {
    id: recruitmentId("user", user.id),
    email: user.email,
    name: user.name,
    year: user.year,
    resumeUploadedAt:
      user.resume_upload instanceof Date
        ? user.resume_upload.toISOString()
        : user.resume_upload,
    ...extensions,
  };
}

export function legacyStatusesToApplicationStage(
  applicationStatus: string,
  interviewStatus: string,
): ApplicationStage {
  if (applicationStatus === LegacyApplicationStatus.Accepted) {
    return ApplicationStage.Accepted;
  }

  if (applicationStatus === LegacyApplicationStatus.Rejected) {
    return ApplicationStage.Rejected;
  }

  if (applicationStatus === LegacyApplicationStatus.Waitlisted) {
    return ApplicationStage.Waitlisted;
  }

  if (interviewStatus === LegacyInterviewStatus.Scheduled) {
    return ApplicationStage.InterviewScheduled;
  }

  if (interviewStatus === LegacyInterviewStatus.Finished) {
    return ApplicationStage.Interviewed;
  }

  // Existing Pending records already sit in the reviewer queue. New
  // submissions enter the distinct Applied stage through submitApplication.
  return ApplicationStage.InReview;
}

/** Fields observed on the current public job fixture / legacy Jobs surface. */
export interface LegacyJobFields {
  id?: string;
  title: string;
  department: string;
  division?: string | null;
  applicationLink?: string | null;
}

/** W1 fields that are not represented by the current legacy job shape. */
export interface PostingContractFields {
  id: PostingId;
  department: DepartmentSummary;
  summary: string;
  description: string;
  status: PostingStatus;
  opensAt: IsoDateTime;
  closesAt: IsoDateTime;
  questions?: readonly ApplicationQuestion[];
}

export function legacyJobToPosting(
  job: LegacyJobFields,
  fields: PostingContractFields,
): Posting {
  return {
    id: fields.id,
    department: fields.department,
    title: job.title,
    summary: fields.summary,
    description: fields.description,
    status: fields.status,
    opensAt: fields.opensAt,
    closesAt: fields.closesAt,
    questions: fields.questions ?? [],
  };
}
