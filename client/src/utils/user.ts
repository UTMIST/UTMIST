import type { UserProfile } from "@/types/auth";
import { supabase } from "@/lib/supabase/client";

/**
 * Get user profile by ID from the public.user table
 * @param userId - The user ID to fetch
 * @returns Promise<UserProfile | null> - The user profile or null if not found
 */
export const getUserById = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching user by ID:", profileError);
      return null;
    }

    if (!profileData) {
      return null;
    }

    // Convert database record to UserProfile type
    return {
      id: profileData.id,
      email: profileData.email || "",
      name: profileData.name || "",
      title: profileData.title || "",
      bio: profileData.bio || "",
      organization: profileData.organization || "",
      avatar: profileData.avatar || "",
      linkedin: profileData.linkedin || "",
      github: profileData.github || "",
      twitter: profileData.twitter || "",
      discord: profileData.discord || "",
      calendly: profileData.calendly || "",
      year: profileData.year || "",
      admin: profileData.admin ?? false,
      resume_upload: profileData.resume_upload || null,
      created_at: profileData.created_at,
      updated_at: profileData.updated_at,
    };
  } catch (error) {
    console.error("Error in getUserById:", error);
    return null;
  }
};

/**
 * Get current user's profile from the public.user table
 * @returns Promise<UserProfile | null> - The current user's profile or null if not found
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    return await getUserById(user.id);
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error);
    return null;
  }
};

/**
 * Update user profile in the public.user table
 * @param userId - The user ID to update
 * @param profileData - Profile data to update
 * @returns Promise<boolean> - Success status
 */
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
): Promise<boolean> => {
  try {
    const { error: updateError } = await supabase
      .from("user")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return false;
  }
};

/**
 * Create user profile in the public.user table
 * @param userId - The user ID
 * @param profileData - Profile data to create
 * @returns Promise<boolean> - Success status
 */
export const createUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
): Promise<boolean> => {
  try {
    const { error: insertError } = await supabase.from("user").insert({
      id: userId,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Error creating user profile:", insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in createUserProfile:", error);
    return false;
  }
};
