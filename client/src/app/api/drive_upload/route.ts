import {
  uploadToGoogleDrive,
  validatePDF,
  validateGoogleDriveConfig,
} from "@/lib/google-drive";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const configError = validateGoogleDriveConfig();
    if (configError) {
      return new Response(JSON.stringify({ error: configError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create Supabase client and get authenticated user
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

    // Get user profile to get the name and last upload time
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

    // Check if user can upload (10-minute limit)
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileBuffer = await file.arrayBuffer();

    if (!validatePDF(fileBuffer)) {
      return new Response(
        JSON.stringify({ error: "File is not a valid PDF" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the new filename: user.name_user.id.pdf
    const sanitizedName = userProfile.name.replace(/[^a-zA-Z0-9]/g, "_");
    const newFileName = `${sanitizedName}_${user.id}.pdf`;

    // If user has uploaded before (resume_upload is not null), replace the file
    const shouldReplace = userProfile.resume_upload !== null;
    const result = await uploadToGoogleDrive(
      fileBuffer,
      newFileName,
      shouldReplace
    );

    // Update the user's resume_upload timestamp
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
