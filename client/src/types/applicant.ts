export type ApplicantStatus = 'pending' | 'accepted' | 'rejected' | 'waitlisted';

export interface ApplicantStatusUpdate {
  status: ApplicantStatus;
  email?: string; // Optional email for notification
}

export interface ApplicantStatusResponse {
  message: string;
  status?: ApplicantStatus;
  emailSent?: boolean;
}
