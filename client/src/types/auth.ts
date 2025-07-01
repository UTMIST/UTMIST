export interface UserProfile {
  id: string;
  avatar?: string;
  bio?: string;
  title?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  created_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  profile: UserProfile;
  message?: string;
}

export interface AuthError {
  error: string;
}

export type AuthErrorCode =
  | "EMAIL_ALREADY_TAKEN"
  | "EMAIL_NEEDS_CONFIRMATION"
  | "INVALID_CREDENTIALS"
  | "WEAK_PASSWORD"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export interface RegistrationResult {
  requiresEmailConfirmation: boolean;
  message?: string;
  errorCode?: AuthErrorCode;
}
