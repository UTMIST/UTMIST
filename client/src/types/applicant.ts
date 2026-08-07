export type ApplicantStatus = 'ACCEPTED' | 'REJECTED' | 'WAITLISTED';

export interface ApplicantStatusUpdate {
  status: ApplicantStatus;
}

export interface ApplicantStatusResponse {
  message: string;
  status?: ApplicantStatus;
}
