import { uploadToGoogleDrive, validatePDF, validateGoogleDriveConfig } from '@/lib/google-drive';

export async function POST(request: Request) {
  try {
    const configError = validateGoogleDriveConfig();
    if (configError) {
      return new Response(
        JSON.stringify({ error: configError }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const fileBuffer = await file.arrayBuffer();

    if (!validatePDF(fileBuffer)) {
      return new Response(
        JSON.stringify({ error: "File is not a valid PDF" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await uploadToGoogleDrive(fileBuffer, file.name);

    return new Response(
      JSON.stringify({
        success: true,
        fileId: result.id,
        webViewLink: result.webViewLink,
        message: "File uploaded to Google Drive successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);

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
