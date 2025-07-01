import { supabase } from "@/lib/supabase";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload avatar image to Supabase storage
 * @param file - The image file to upload
 * @param userId - The user ID to associate with the avatar
 * @returns Promise<UploadResult> - Upload result with URL or error
 */
export const uploadAvatar = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Please select a valid image file",
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: "Image size must be less than 5MB",
      };
    }

    // Use "image" as filename (no extension)
    const fileName = "image";
    const filePath = `profile/${userId}/${fileName}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from("utmist-website")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Overwrite existing file
      });

    if (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error.message || "Failed to upload image",
      };
    }

    // Get signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from("utmist-website")
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (urlError) {
      console.error("Signed URL error:", urlError);
      return {
        success: false,
        error: "Failed to generate image URL",
      };
    }

    return {
      success: true,
      url: urlData.signedUrl,
    };
  } catch (error) {
    console.error("Avatar upload error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during upload",
    };
  }
};

/**
 * Delete avatar from Supabase storage
 * @param userId - The user ID whose avatar to delete
 * @returns Promise<boolean> - Success status
 */
export const deleteAvatar = async (userId: string): Promise<boolean> => {
  try {
    // Delete the specific "image" file
    const filePath = `profile/${userId}/image`;

    const { error: deleteError } = await supabase.storage
      .from("utmist-website")
      .remove([filePath]);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete avatar error:", error);
    return false;
  }
};

/**
 * Get avatar URL for a user
 * @param userId - The user ID
 * @returns Promise<string | null> - Avatar URL or null if not found
 */
export const getAvatarUrl = async (userId: string): Promise<string | null> => {
  try {
    // Check if the "image" file exists
    const filePath = `profile/${userId}/image`;

    // Test if the file actually exists by trying to list it
    const { data: files, error } = await supabase.storage
      .from("utmist-website")
      .list(`profile/${userId}`);

    if (error || !files) {
      return null;
    }

    // Check if "image" file exists
    const imageFile = files.find((file) => file.name === "image");

    if (!imageFile) {
      return null;
    }

    // Get signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from("utmist-website")
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (urlError) {
      console.error("Signed URL error:", urlError);
      return null;
    }

    return urlData.signedUrl;
  } catch (error) {
    console.error("Get avatar URL error:", error);
    return null;
  }
};
