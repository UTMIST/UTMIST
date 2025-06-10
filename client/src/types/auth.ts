export interface UserProfile {
  email: string;
  name: string;
  organization?: string;
  profile_picture_url?: string;
}

export interface AuthResponse {
  token: string;
  profile: UserProfile;
  message?: string;
}

export interface AuthError {
  error: string;
} 