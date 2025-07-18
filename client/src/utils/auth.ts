import type { UserProfile, AuthUser } from '@/types/auth';
import { supabase } from '@/lib/supabase';

// Constants for error handling
const AUTH_ERRORS = {
  EMAIL_ALREADY_TAKEN: 'EMAIL_ALREADY_TAKEN',
  EMAIL_NEEDS_CONFIRMATION: 'EMAIL_NEEDS_CONFIRMATION',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_FAILED: 'SESSION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

// Constants for auth configuration
const AUTH_CONFIG = {
  DUMMY_PASSWORD: 'dummy-password-check-123456789',
  DEFAULT_PROFILE_PICTURE: 'profile_pictures/default.webp',
  CALLBACK_PATH: '/auth/callback',
  SET_COOKIE_ENDPOINT: '/api/auth/set-cookie',
  SIGNOUT_ENDPOINT: '/api/auth/signout',
} as const;

/**
 * Get the currently authenticated user
 * @returns Promise<AuthUser | null> - The authenticated user or null if not authenticated
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Convert Supabase user to our User type using metadata
    const metadata = user.user_metadata || {};
    return {
      id: user.id,
      email: user.email || '',
      firstName: metadata.firstName || '',
      lastName: metadata.lastName || '',
      name: metadata.name || `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim() || user.email?.split('@')[0] || '',
    };
  } catch {
    return null;
  }
};

/**
 * Get the full user profile from auth metadata
 * @returns Promise<UserProfile | null> - The user profile or null if not authenticated
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Get all profile data from auth metadata - no database queries needed!
    const metadata = user.user_metadata || {};
    return {
      id: user.id,
      email: user.email || '',
      name: metadata.name || `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim() || user.email?.split('@')[0] || '',
      organization: metadata.organization || '',
      profile_picture_url: metadata.profile_picture_url || AUTH_CONFIG.DEFAULT_PROFILE_PICTURE,
      linkedin_url: metadata.linkedin_url || '',
      github_url: metadata.github_url || '',
      discord_username: metadata.discord_username || '',
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  } catch {
    return null;
  }
};

/**
 * Check if the current user is authenticated
 * @returns Promise<boolean> - True if authenticated, false otherwise
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

/**
 * Check if email already exists in the system
 * @param email - Email to check
 * @returns Promise<{exists: boolean, confirmed: boolean}>
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkEmailExists = async (email: string): Promise<{exists: boolean, confirmed: boolean}> => {
  try {
    // Try to sign in with a dummy password to check user existence
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: AUTH_CONFIG.DUMMY_PASSWORD,
    });

    // DEBUG: Log what Supabase actually returns
    console.log('=== EMAIL CHECK DEBUG ===');
    console.log('Email:', email);
    console.log('Error message:', error?.message);
    console.log('Error code:', error?.code);
    console.log('Has user:', !!data.user);
    console.log('========================');

    if (error) {
      // "Invalid login credentials" typically means user exists but password is wrong
      if (error.message?.includes('Invalid login credentials')) {
        console.log('→ Detected as: user exists (confirmed)');
        return { exists: true, confirmed: true };
      }
      
      // Email not confirmed error - user exists but not confirmed
      if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
        console.log('→ Detected as: user exists (unconfirmed)');
        return { exists: true, confirmed: false };
      }
      
      // For other errors, assume user doesn't exist
      console.log('→ Detected as: user does not exist');
      return { exists: false, confirmed: false };
    }

    // If login somehow succeeded with dummy password (very unlikely)
    if (data.user) {
      await supabase.auth.signOut(); // Clean up
      console.log('→ Detected as: user exists (login succeeded)');
      return { exists: true, confirmed: true };
    }

    console.log('→ Detected as: user does not exist (no error, no user)');
    return { exists: false, confirmed: false };
  } catch {
    console.log('→ Detected as: user does not exist (catch block)');
    // On error, assume email doesn't exist to allow registration attempt
    return { exists: false, confirmed: false };
  }
};

/**
 * Handle different Supabase auth errors
 * @param error - The Supabase error
 * @returns string - Standardized error code or message
 */
const handleAuthError = (error: {message?: string}): string => {
  if (!error?.message) return 'An unknown error occurred';

  // Check for user already exists errors
  if (error.message?.includes('user_already_exists') || 
      error.message?.includes('email_exists') ||
      error.message?.includes('User already registered') ||
      error.message?.includes('duplicate')) {
    return AUTH_ERRORS.EMAIL_ALREADY_TAKEN;
  }
  
  // Check for email confirmation related errors
  if (error.message?.includes('email_address_not_authorized') ||
      error.message?.includes('email_not_confirmed') ||
      error.message?.includes('Email not confirmed')) {
    return AUTH_ERRORS.EMAIL_NEEDS_CONFIRMATION;
  }
  
  // Signup disabled errors (could indicate user exists)
  if (error.message?.includes('Signups not allowed') ||
      error.message?.includes('signup_disabled')) {
    return AUTH_ERRORS.EMAIL_ALREADY_TAKEN;
  }
  
  // Return the original message for other errors
  return error.message;
};

/**
 * Set session cookies on the server
 * @param session - The Supabase session
 * @returns Promise<void>
 */
const setSessionCookies = async (session: {access_token: string; refresh_token: string}): Promise<void> => {
  try {
    await fetch(AUTH_CONFIG.SET_COOKIE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'SIGNED_IN', session })
    });
  } catch {
    throw new Error('Failed to establish session');
  }
};

/**
 * Register a new user with email and password
 * @param email - User's email
 * @param password - User's password
 * @param name - User's full name
 * @param organization - Optional organization
 * @param linkedin_url - Optional LinkedIn URL
 * @param github_url - Optional GitHub URL
 * @param discord_username - Optional Discord username
 * @returns Promise<{requiresEmailConfirmation: boolean, message?: string}>
 */
export const register = async (
  email: string, 
  password: string, 
  name: string, 
  organization?: string,
  linkedin_url?: string,
  github_url?: string,
  discord_username?: string
  ): Promise<{ requiresEmailConfirmation: boolean; message?: string }> => {
  
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const registrationData = {
    firstName,
    lastName,
    name,
    organization: organization || '',
    linkedin_url: linkedin_url || '',
    github_url: github_url || '',
    discord_username: discord_username || '',
    profile_picture_url: AUTH_CONFIG.DEFAULT_PROFILE_PICTURE,
  };

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${AUTH_CONFIG.CALLBACK_PATH}`,
        data: registrationData
      }
    });

    if (error) {
      console.error('Supabase registration error:', error);
      // Use the existing error handler to provide user-friendly error messages
      const handledError = handleAuthError(error);
      throw new Error(handledError);
    }

    // Registration successful - data stored in auth.users.raw_user_meta_data
    return {
      requiresEmailConfirmation: true,
      message: 'Please check your email! If this is your first time, you\'ll receive a confirmation link to activate your account. If you already have an account, please login instead.'
    };
  } catch (error) {
    console.error('Registration error:', error);
    // Re-throw the error so it can be handled by the calling code
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during registration. Please try again.');
  }
};

/**
 * Sign in with email and password
 * @param email - User's email
 * @param password - User's password
 * @returns Promise<void>
 */
export const login = async (email: string, password: string): Promise<void> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.session) {
    throw new Error('Login failed - no session created');
  }

  // Set session cookies on server
  await setSessionCookies(data.session);
};

/**
 * Sign in with Google OAuth
 * @returns Promise<void>
 */
export const signInWithGoogle = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${AUTH_CONFIG.CALLBACK_PATH}`,
    }
  });

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign out the current user
 * @returns Promise<void>
 */
export const logout = async (): Promise<void> => {
  try {
    // Clear session on server
    await fetch(AUTH_CONFIG.SIGNOUT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Sign out from Supabase client
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Send password reset email
 * @param email - User's email
 * @returns Promise<void>
 */
export const resetPassword = async (email: string): Promise<void> => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${AUTH_CONFIG.CALLBACK_PATH}?type=recovery`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Resend confirmation email for unconfirmed accounts
 * @param email - User's email
 * @returns Promise<void>
 */
export const resendConfirmation = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}${AUTH_CONFIG.CALLBACK_PATH}`
    }
  });

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Update user profile information
 * @param profileData - Profile data to update
 * @returns Promise<void>
 */
export const updateProfile = async (profileData: {
  name?: string;
  organization?: string;
  linkedin_url?: string;
  github_url?: string;
  discord_username?: string;
  profile_picture_url?: string;
}): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    data: profileData
  });

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Listen for authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Function to unsubscribe from auth state changes
 */
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Export auth error constants for use in components
export { AUTH_ERRORS }; 