export type ApplicantStatus = 'pending' | 'accepted' | 'rejected' | 'waitlisted';

export interface ApplicantStatusUpdate {
  status: ApplicantStatus;
}

export interface ApplicantStatusResponse {
  message: string;
  status?: ApplicantStatus;
}
