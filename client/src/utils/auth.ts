import type { UserProfile, AuthUser } from '@/types/auth';
import { supabase } from "@/lib/supabase/client";
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
 * Get the full user profile from public.user table
 * @returns Promise<UserProfile | null> - The user profile or null if not authenticated
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Try to get profile from public.user table first
    const { data: profileData, error: profileError } = await supabase
      .from('user')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData && !profileError) {
      // Return data from public.user table
      return {
        id: profileData.id,
        email: profileData.email || user.email || '',
        name: profileData.name || user.email?.split('@')[0] || '',
        title: profileData.title || '',
        bio: profileData.bio || '',
        organization: profileData.organization || '',
        avatar: profileData.avatar || AUTH_CONFIG.DEFAULT_PROFILE_PICTURE,
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        twitter: profileData.twitter || '',
        discord: profileData.discord || '',
        created_at: profileData.created_at || user.created_at,
        updated_at: profileData.updated_at || user.updated_at || user.created_at,
      };
    }

    // Fallback to auth metadata if no profile in database
    const metadata = user.user_metadata || {};
    return {
      id: user.id,
      email: user.email || '',
      name: metadata.name || `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim() || user.email?.split('@')[0] || '',
      title: metadata.title || '',
      bio: metadata.bio || '',
      organization: metadata.organization || '',
      avatar: metadata.profile_picture_url || metadata.avatar || AUTH_CONFIG.DEFAULT_PROFILE_PICTURE,
      linkedin: metadata.linkedin_url || metadata.linkedin || '',
      github: metadata.github_url || metadata.github || '',
      twitter: metadata.twitter_url || metadata.twitter || '',
      discord: metadata.discord_username || metadata.discord || '',
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
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
 * @param linkedin - Optional LinkedIn URL
 * @param github - Optional GitHub URL
 * @param discord - Optional Discord username
 * @returns Promise<{requiresEmailConfirmation: boolean, message?: string}>
 */
export const register = async (
  email: string, 
  password: string, 
  name: string, 
  organization?: string,
  linkedin?: string,
  github?: string,
  discord?: string
  ): Promise<{ requiresEmailConfirmation: boolean; message?: string }> => {
  
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const registrationData = {
    firstName,
    lastName,
    name,
    organization: organization || '',
    linkedin: linkedin || '',
    github: github || '',
    discord: discord || '',
    // Keep old field names for auth metadata compatibility
    linkedin_url: linkedin || '',
    github_url: github || '',
    discord_username: discord || '',
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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
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
 * Update user profile information in public.user table
 * @param profileData - Profile data to update
 * @returns Promise<void>
 */
export const updateProfile = async (profileData: {
  name?: string;
  title?: string;
  bio?: string;
  organization?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  discord?: string;
  avatar?: string;
}): Promise<void> => {
  try {
    // Get current user to get the ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    // Update the public.user table
    const { error: updateError } = await supabase
      .from('user')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      // If user doesn't exist in public.user table, create it
      if (updateError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('user')
          .insert({
            id: user.id,
            email: user.email,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          throw new Error(`Failed to create user profile: ${insertError.message}`);
        }
      } else {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }
    }

    // Also update auth metadata for consistency
    const { error: authError } = await supabase.auth.updateUser({
      data: profileData
    });

    if (authError) {
      console.warn('Failed to update auth metadata:', authError.message);
      // Don't fail the whole operation if auth metadata update fails
    }

  } catch (error) {
    console.error('Profile update error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while updating profile');
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