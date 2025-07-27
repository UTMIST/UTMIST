import { supabase } from "@/lib/supabase";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadFile = async (
  file: File,
  filePath: string,
  options?: {
    allowedTypes?: string[];
    maxSize?: number;
    updateUserProfile?: boolean;
  }
): Promise<UploadResult> => {
  try {
    const {
      allowedTypes,
      maxSize = 5 * 1024 * 1024,
      updateUserProfile = false,
    } = options || {};

    // Validate file type if specified
    if (
      allowedTypes &&
      !allowedTypes.some((type) => file.type.includes(type))
    ) {
      const typesList = allowedTypes.join(", ");
      return {
        success: false,
        error: `Please select a valid file. Allowed types: ${typesList}`,
      };
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        success: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    // Upload file to Supabase storage
    console.log("Uploading file to:", filePath);
    const { error, data } = await supabase.storage
      .from("utmist-website")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) {
      console.error("Upload error:", error);

      return {
        success: false,
        error: error.message || "Failed to upload file",
      };
    }
    const { data: publicURL } = supabase.storage
      .from("utmist-website")
      .getPublicUrl(filePath);
    return {
      success: true,
      url: publicURL.publicUrl,
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload file",
    };
  }
};

export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    const { error: deleteError } = await supabase.storage
      .from("utmist-website")
      .remove([filePath]);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete file error:", error);
    return false;
  }
};

export const getFile = async (filePath: string): Promise<string | null> => {
  try {
    const { data: urlData, error: urlError } = await supabase.storage
      .from("utmist-website")
      .createSignedUrl(filePath, 3600);

    if (urlError) {
      console.error("Signed URL error:", urlError);
      return null;
    }

    return urlData.signedUrl;
  } catch (error) {
    console.error("Get file URL error:", error);
    return null;
  }
};

export const getFileUrl = async (filePath: string): Promise<string | null> => {
  const url = await getFile(filePath);
  return url;
};
