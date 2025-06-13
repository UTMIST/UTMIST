export interface UserProfile {
  email: string;
  name: string;
  organization?: string;
  profile_picture_url?: string;
  linkedin_url?: string;
  github_url?: string;
  discord_username?: string;
}

export interface AuthResponse {
  token: string;
  profile: UserProfile;
  message?: string;
}

export interface AuthError {
  error: string;
} 