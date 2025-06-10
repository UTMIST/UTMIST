import type { UserProfile } from '@/types/auth';
import { getApiUrl } from '@/config/api';

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const profile = localStorage.getItem('userProfile');
  return profile ? JSON.parse(profile) : null;
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('userProfile');
  window.location.href = '/auth';
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

interface AuthResponse {
  token: string;
  profile: {
    id: number;
    email: string;
    name: string;
    organization?: string;
    profile_picture_url?: string;
    linkedin_url?: string;
    github_url?: string;
    discord_username?: string;
  };
}

interface AuthError {
  error: string;
}

export async function login(email: string, password: string): Promise<void> {
  const url = getApiUrl('/api/accounts/login/');
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json() as AuthResponse | AuthError;

  if (!response.ok) {
    throw new Error('error' in data ? data.error : 'Login failed');
  }

  const authData = data as AuthResponse;
  localStorage.setItem('token', authData.token);
  localStorage.setItem('userProfile', JSON.stringify(authData.profile));
}

export async function register(
  email: string, 
  password: string, 
  name: string, 
  organization?: string,
  linkedin_url?: string,
  github_url?: string,
  discord_username?: string
): Promise<void> {
  const url = getApiUrl('/api/accounts/register/');
  const formData = new FormData();
  
  formData.append('email', email);
  formData.append('password', password);
  formData.append('name', name);
  if (organization) {
    formData.append('organization', organization);
  }
  if (linkedin_url) {
    formData.append('linkedin_url', linkedin_url);
  }
  if (github_url) {
    formData.append('github_url', github_url);
  }
  if (discord_username) {
    formData.append('discord_username', discord_username);
  }

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json() as AuthResponse | AuthError;

  if (!response.ok) {
    throw new Error('error' in data ? data.error : 'Registration failed');
  }

  const authData = data as AuthResponse;
  localStorage.setItem('token', authData.token);
  localStorage.setItem('userProfile', JSON.stringify(authData.profile));
} 