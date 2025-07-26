import { getAvatarUrl } from "./upload";

/**
 * Get the display avatar URL for a user
 * @param userId - The user ID
 * @returns Promise<string> - The avatar URL to display
 */
export const getDisplayAvatarUrl = async (userId: string): Promise<string> => {
  // Always try to get the latest avatar from storage
  try {
    const storageUrl = await getAvatarUrl(userId);
    if (storageUrl) {
      return storageUrl;
    }
  } catch (error) {
    console.error("Error getting avatar from storage:", error);
  }

  // Fallback to default avatar
  return "/profile_pictures/default.webp";
};

/**
 * Check if an avatar URL is from Supabase storage
 * @param url - The URL to check
 * @returns boolean - True if it's a Supabase storage URL
 */
export const isSupabaseStorageUrl = (url: string): boolean => {
  return (
    url.includes("supabase.co") && url.includes("/storage/v1/object/public/")
  );
};

/**
 * Get the default avatar URL
 * @returns string - The default avatar URL
 */
export const getDefaultAvatarUrl = (): string => {
  return "/profile_pictures/default.webp";
};
