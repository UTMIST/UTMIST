export interface UserProfile {
  id: string;
  email: string;
  name: string;
  title?: string;
  bio?: string;
  organization?: string;
  avatar?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  discord?: string;
  created_at?: string;
  updated_at?: string;
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
  | 'EMAIL_ALREADY_TAKEN'
  | 'EMAIL_NEEDS_CONFIRMATION'
  | 'INVALID_CREDENTIALS'
  | 'WEAK_PASSWORD'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface RegistrationResult {
  requiresEmailConfirmation: boolean;
  message?: string;
  errorCode?: AuthErrorCode;
} 