import {
  uploadToGoogleDrive,
  validatePDF,
  validateGoogleDriveConfig,
} from "@/lib/google-drive";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * API Route: Resume Upload to Google Drive
 *
 * Handles the upload of user resumes to Google Drive with authentication,
 * rate limiting, and file validation. NOTE: this route has nothing to do with
 * uploading the actual resume. This route assumes that the resume is already
 * uploaded to supabase storage.
 *
 *
 * @route POST /api/drive_upload
 *
 * @security
 * - Requires user authentication via Supabase cookies
 * - Validates user profile exists and has required fields
 * - Enforces 10-minute rate limiting between uploads
 *
 * @validation
 * - File must be a valid PDF (validated by file signature)
 * - Google Drive configuration must be properly set up through .env vars
 * - User must have a complete profile with name field
 *
 * @rateLimit
 * - Users can only upload once every 10 minutes
 * - Returns 429 status with remaining wait time if limit exceeded
 *
 * @fileNaming
 * - Files are renamed to: `{sanitized_user_name}_{user_id}.pdf`
 * - Special characters in names are replaced with underscores
 * - Ensures unique filenames and prevents conflicts
 *
 * @behavior
 * - If user has uploaded before, replaces the existing file
 * - Updates user's `resume_upload` timestamp on success
 * - Returns Google Drive file ID and web view link
 *
 *
 * @param {Request} request - Next.js request object containing FormData with a key "file" in the request body
 * @example
 * ```typescript
 *
 * // Success response:
 * {
 *   success: true,
 *   fileId: "1ABC123...",
 *   webViewLink: "https://drive.google.com/file/d/...",
 *   message: "File uploaded to Google Drive successfully",
 *   fileName: "John_Doe_user123.pdf"
 * }
 *
 * // Error responses:
 * // 401: Authentication failed
 * // 404: User profile not found
 * // 429: Rate limit exceeded
 * // 400: Invalid file (not PDF) or no file provided
 * // 500: Server/configuration error
 * ```
 */
export async function POST(request: Request) {
  try {
    // Validate Google Drive configuration before proceeding
    const configError = validateGoogleDriveConfig();
    if (configError) {
      return new Response(JSON.stringify({ error: configError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    /**
     * Authentication: Create Supabase client and verify user authentication
     * Uses server-side cookies to maintain session state
     */
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    /**
     * User Profile Validation: Fetch user profile to get name and last upload timestamp
     * Name is required for file naming, resume_upload is used for rate limiting
     */
    const { data: userProfile, error: profileError } = await supabase
      .from("user")
      .select("name, resume_upload")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile?.name) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    /**
     * Rate Limiting: Check if user can upload based on 10-minute cooldown
     * Compares current time with last upload timestamp
     */
    if (userProfile.resume_upload) {
      const lastUpload = new Date(userProfile.resume_upload);
      const now = new Date();
      const timeDiff = now.getTime() - lastUpload.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      if (minutesDiff < 10) {
        const remainingMinutes = 10 - minutesDiff;
        return new Response(
          JSON.stringify({
            error: `Please wait ${remainingMinutes} more minutes before uploading again.`,
            remainingMinutes,
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Extract file from FormData request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert file to buffer and validate PDF format by checking file signature
    const fileBuffer = await file.arrayBuffer();

    if (!validatePDF(fileBuffer)) {
      return new Response(
        JSON.stringify({ error: "File is not a valid PDF" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    /**
     * File Naming: Generate unique filename based on user data
     * Format: {sanitized_name}_{user_id}.pdf
     * Sanitization removes special characters to prevent file system issues
     */
    const sanitizedName = userProfile.name.replace(/[^a-zA-Z0-9]/g, "_");
    const newFileName = `${sanitizedName}_${user.id}.pdf`;

    /**
     * Google Drive Upload: Upload file to shared drive
     * If user has uploaded before, replace existing file to avoid duplicates
     */
    const shouldReplace = userProfile.resume_upload !== null;
    const result = await uploadToGoogleDrive(
      fileBuffer,
      newFileName,
      shouldReplace
    );

    /**
     * Database Update: Record successful upload timestamp
     * Used for rate limiting and tracking upload history
     */
    const { error: updateError } = await supabase
      .from("user")
      .update({
        resume_upload: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating resume_upload timestamp:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        fileId: result.id,
        webViewLink: result.webViewLink,
        message: "File uploaded to Google Drive successfully",
        fileName: newFileName,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: "Check server logs for more information",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
