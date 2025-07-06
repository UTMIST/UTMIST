import type { UserProfile, AuthUser } from "@/types/auth";
import { supabase } from "@/lib/supabase";

// Constants for error handling
const AUTH_ERRORS = {
  EMAIL_ALREADY_TAKEN: "EMAIL_ALREADY_TAKEN",
  EMAIL_NEEDS_CONFIRMATION: "EMAIL_NEEDS_CONFIRMATION",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_FAILED: "SESSION_FAILED",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

// Constants for auth configuration
const AUTH_CONFIG = {
  DUMMY_PASSWORD: "dummy-password-check-123456789",
  DEFAULT_PROFILE_PICTURE: "profile_pictures/default.webp",
  CALLBACK_PATH: "/auth/callback",
  SET_COOKIE_ENDPOINT: "/api/auth/set-cookie",
  SIGNOUT_ENDPOINT: "/api/auth/signout",
} as const;

/**
 * Get the currently authenticated user
 * @returns Promise<AuthUser | null> - The authenticated user or null if not authenticated
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Convert Supabase user to our User type using metadata
    const metadata = user.user_metadata || {};
    return {
      id: user.id,
      email: user.email || "",
      firstName: metadata.firstName || "",
      lastName: metadata.lastName || "",
      name:
        metadata.name ||
        `${metadata.firstName || ""} ${metadata.lastName || ""}`.trim() ||
        user.email?.split("@")[0] ||
        "",
    };
  } catch {
    return null;
  }
};

/**
 * Get the full user profile from the User table
 * @returns Promise<UserProfile | null> - The user profile or null if not authenticated
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const { data } = await supabase
      .from("user")
      .select("*")
      .eq("id", user.id)
      .single();
    return data;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};

/**
 * Update user profile in the User table
 * @param profileData - Profile data to update
 * @returns Promise<void>
 */
export const updateUserProfile = async (profileData: {
  avatar?: string;
  bio?: string;
  title?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const { error } = await supabase.from("user").upsert(
      {
        id: user.id,
        ...profileData,
      },
      {
        onConflict: "id",
      }
    );

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Create or update user profile in the User table
 * @param profileData - Profile data to create/update
 * @returns Promise<UserProfile>
 */
export const createOrUpdateUserProfile = async (profileData: {
  avatar?: string;
  bio?: string;
  title?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}): Promise<UserProfile> => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const { data } = await supabase
      .from("user")
      .upsert(
        {
          id: user.id,
          ...profileData,
        },
        {
          onConflict: "id",
        }
      )
      .select()
      .single();

    if (!data) {
      throw new Error("No data returned from Supabase");
    }

    return data;
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    throw error;
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
 * Set session cookies on the server
 * @param session - The Supabase session
 * @returns Promise<void>
 */
const setSessionCookies = async (session: unknown): Promise<void> => {
  try {
    await fetch(AUTH_CONFIG.SET_COOKIE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "SIGNED_IN", session }),
    });
  } catch {
    throw new Error("Failed to establish session");
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
  const nameParts = name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const registrationData = {
    firstName,
    lastName,
    name,
    organization: organization || "",
    linkedin_url: linkedin_url || "",
    github_url: github_url || "",
    discord_username: discord_username || "",
    profile_picture_url: AUTH_CONFIG.DEFAULT_PROFILE_PICTURE,
  };

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${AUTH_CONFIG.CALLBACK_PATH}`,
        data: registrationData,
      },
    });

    if (error) {
      console.error("Supabase registration error:", error);
    }
  } catch (error) {
    console.error("Registration error:", error);
  }

  // Always return the same elegant message regardless of the scenario
  // This covers both new registrations and existing users gracefully
  return {
    requiresEmailConfirmation: true,
    message:
      "Please check your email! If this is your first time, you'll receive a confirmation link to activate your account. If you already have an account, please login instead.",
  };
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
    throw new Error("Login failed - no session created");
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
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}${AUTH_CONFIG.CALLBACK_PATH}`,
    },
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    redirectTo: `${window.location.origin}${AUTH_CONFIG.CALLBACK_PATH}`,
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
    type: "signup",
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}${AUTH_CONFIG.CALLBACK_PATH}`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Update user auth metadata (for basic profile info stored in Supabase auth)
 * @param profileData - Profile data to update in auth metadata
 * @returns Promise<void>
 */
export const updateAuthMetadata = async (profileData: {
  firstName?: string;
  lastName?: string;
  name?: string;
  organization?: string;
  linkedin_url?: string;
  github_url?: string;
  discord_username?: string;
  profile_picture_url?: string;
}): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    data: profileData,
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
export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void
) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
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
