import { google } from "googleapis";
import { Readable } from "stream";

const SCOPE = ["https://www.googleapis.com/auth/drive"];

function isPDF(buffer: ArrayBuffer): boolean {
  const uint8Array = new Uint8Array(buffer);
  const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF

  if (uint8Array.length < 4) return false;

  for (let i = 0; i < 4; i++) {
    if (uint8Array[i] !== pdfSignature[i]) {
      return false;
    }
  }

  return true;
}

function createGoogleAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      project_id: process.env.GOOGLE_PROJECT_ID,
    },
    scopes: SCOPE,
  });
  return auth;
}

export async function uploadToGoogleDrive(
  fileBuffer: ArrayBuffer,
  fileName: string
): Promise<{ id: string; webViewLink: string }> {
  const auth = createGoogleAuth();
  const drive = google.drive({ version: "v3", auth });

  const buffer = Buffer.from(fileBuffer);

  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);

  const metadata = {
    name: fileName,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
  };
  console.log(metadata);
  const media = {
    mimeType: "application/pdf",
    body: readable,
  };

  const response = await drive.files.create({
    requestBody: metadata,
    media: media,
    supportsAllDrives: true,
  });

  const file = response.data;
  console.log(file);

  if (!file.id) {
    throw new Error("Failed to get file ID from Google Drive response");
  }

  await drive.permissions.create({
    fileId: file.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
    supportsAllDrives: true,
  });

  return {
    id: file.id,
    webViewLink:
      file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
  };
}

export function validatePDF(buffer: ArrayBuffer): boolean {
  return isPDF(buffer);
}

export function validateGoogleDriveConfig(): string | null {
  const requiredEnvVars = ["GOOGLE_PRIVATE_KEY", "GOOGLE_CLIENT_EMAIL"];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      return `Missing environment variable: ${envVar}`;
    }
  }

  return null;
}
