import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

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
    bucketName?: string;
    isPublic?: boolean;
  }
): Promise<UploadResult> => {
  try {
    const {
      allowedTypes,
      maxSize = 5 * 1024 * 1024,
      bucketName = "utmist-website",
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
    const { error } = await supabase.storage
      .from(bucketName)
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
      .from(bucketName)
      .getPublicUrl(filePath);
    toast("Success! It might take a while before your changes are reflected.");
    return {
      success: true,
      url: publicURL.publicUrl,
    };
  } catch (error: unknown) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
};

export const deleteFile = async (
  filePath: string,
  options?: {
    bucketName?: string;
    isPublic?: boolean;
  }
): Promise<boolean> => {
  try {
    console.log("Deleting file:", filePath);
    const { bucketName = "utmist-website" } = options || {};
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
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

export const getFile = async (
  filePath: string,
  options?: {
    bucketName?: string;
    isPublic?: boolean;
  }
): Promise<string | null> => {
  try {
    const { bucketName = "utmist-website", isPublic = true } = options || {};
    console.log("Getting file from:", filePath);

    if (isPublic) {
      const { data: publicURL } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      return publicURL.publicUrl;
    }

    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
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
