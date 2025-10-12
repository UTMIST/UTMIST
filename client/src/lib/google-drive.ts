import { google } from "googleapis";
import type { drive_v3 } from "googleapis";
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

function extractUUID(fileName: string): string | null {
    const match = fileName.match(/_([a-f0-9\-]+)\.pdf$/i);
    return match ? match[1] : null;
}

async function findExistingFile(
  drive: ReturnType<typeof google.drive>,
  fileName: string,
  folderId: string
): Promise<string | null> {
  try {
    const sharedDriveId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const uuid = extractUUID(fileName);
    if (!uuid) return null;

    const queryParams: drive_v3.Params$Resource$Files$List = {
      q: `name contains '${uuid}.pdf' and '${folderId}' in parents and trashed=false`,
      fields: "files(id, name)",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      pageSize: 1,
    };

    if (sharedDriveId) {
      queryParams.corpora = "drive";
      queryParams.driveId = sharedDriveId;
    }

    const response = await drive.files.list(queryParams);

    if (response.data.files && response.data.files.length > 0) {
      const fileId = response.data.files[0].id!;

      // Verify the file exists and get its details
      try {
        await drive.files.get({
          fileId: fileId,
          fields: "id, name",
          supportsAllDrives: true,
        });

        return fileId;
      } catch (getError) {
        return getError as string | null;
      }
    }

    return null;
  } catch (error) {
    return error as string | null;
  }
}

export async function uploadToGoogleDrive(
  fileBuffer: ArrayBuffer,
  fileName: string,
  replace: boolean = false,
  folderId?: string
): Promise<{ id: string; webViewLink: string }> {
  const auth = createGoogleAuth();
  const drive = google.drive({ version: "v3", auth });

  const buffer = Buffer.from(fileBuffer);
  const targetFolderId = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID!;

  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);

  const media = {
    mimeType: "application/pdf",
    body: readable,
  };

  let response;
  let fileId;

  if (replace) {
    // Check if file already exists and update it
    const existingFileId = await findExistingFile(drive, fileName, targetFolderId);

    if (existingFileId) {
      console.log(`Updating existing file: ${fileName}`);
      response = await drive.files.update({
        fileId: existingFileId,
        media: media,
        supportsAllDrives: true,
      });
      fileId = existingFileId;
    } else {
      // File doesn't exist but replace=true, create new file
      const metadata = {
        name: fileName,
        parents: [targetFolderId],
      };
      
      response = await drive.files.create({
        requestBody: metadata,
        media: media,
        supportsAllDrives: true,
      });
      fileId = response.data.id;

      if (!fileId) {
        throw new Error("Failed to get file ID from Google Drive response");
      }

      // Set permissions for new files
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
        supportsAllDrives: true,
      });
    }
  } else {
    // Create new file (first upload)
    const metadata = {
      name: fileName,
      parents: [targetFolderId],
    };
    
    response = await drive.files.create({
      requestBody: metadata,
      media: media,
      supportsAllDrives: true,
    });
    fileId = response.data.id;

    if (!fileId) {
      throw new Error("Failed to get file ID from Google Drive response");
    }

    // Set permissions for new files
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
      supportsAllDrives: true,
    });
  }

  return {
    id: fileId,
    webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
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

/**
 * Maps user year to corresponding Google Drive folder ID
 * Throws an error if the year-specific folder is not configured
 *
 * @param year - User's year ('1', '2', '3', '4', '5+', 'masters', 'phd')
 * @returns Folder ID for the specified year
 * @throws Error if folder ID is not configured for the specified year
 */
export function getYearFolderId(year?: string): string | null {
  if (!year) {
    return null;
  }

  const folderMap: Record<string, string | undefined> = {
    '1': '1UjvM5jQuG98o5WVTeFT2Jyk8R2-DnoCc',
    '2': '1yfx8VmjGGZT-g1GPCwe0xIlY8WYs-SFc',
    '3': '1NBiKUpbJiwxFMaspx6M6OiS86vyJf--J',
    '4': '148T0C6ft8Ktv-KvHPDSNraDY8w3nGyM0',
    '5+': '148T0C6ft8Ktv-KvHPDSNraDY8w3nGyM0',
    'masters': '1rCPNw-OO6N3ohohsSFd0Ol6Erm2lZLR-',
    'phd': "1_8GnYlpUjE2ClkiqqnIIWiEOdd0hgETI",
  };

  const folderId = folderMap[year];

  if (!folderId) {
    throw new Error(`Google Drive folder not configured for year: ${year}. Please set the environment variable for this year.`);
  }

  return folderId;
}
