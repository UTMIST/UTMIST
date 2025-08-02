"use client";

import React, { useState, useRef, useEffect } from "react";
import { uploadFile, getFile } from "@/utils/upload";

interface ResumeUploadProps {
  userId: string;
  onResumeChange?: (hasResume: boolean) => void;
  disabled?: boolean;
}

export default function ResumeUpload({
  userId,
  onResumeChange,
  disabled = false,
}: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkResumeExists = async () => {
      const url = await getFile(`${userId}/resume`, {
        bucketName: "private-website",
        isPublic: false,
      });
      setResumeUrl(url);
      onResumeChange?.(url !== null);
    };

    if (userId) {
      checkResumeExists();
    }
  }, [userId, onResumeChange]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const filePath = `${userId}/resume`;
      const result = await uploadFile(file, filePath, {
        allowedTypes: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        maxSize: 10 * 1024 * 1024, // 10MB
        updateUserProfile: false,
        bucketName: "private-website",
        isPublic: false,
      });

      if (result.success) {
        setSuccess("Resume uploaded successfully!");
        setResumeUrl(result.url || null);
        onResumeChange?.(true);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      setError("Resume not found");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              {resumeUrl ? (
                <div className="space-y-2">
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Resume uploaded
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      onClick={handleViewResume}
                      style={{ background: "var(--gradient-b2)" }}
                      className="px-3 py-1 rounded-lg font-[var(--system-font)] text-xs text-white hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] transition-all duration-200"
                    >
                      View Resume
                    </button>
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        style={
                          isUploading
                            ? {}
                            : { background: "var(--gradient-b2)" }
                        }
                        className={`px-3 py-1 rounded-lg font-[var(--system-font)] text-xs transition-all duration-200 ${
                          isUploading
                            ? "text-gray-500 cursor-not-allowed opacity-50 bg-gray-200"
                            : "text-white hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)]"
                        }`}
                      >
                        {isUploading ? "Uploading..." : "Replace Resume"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Upload your resume</p>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      style={
                        isUploading ? {} : { background: "var(--gradient-b2)" }
                      }
                      className={`px-4 py-2 rounded-lg font-[var(--system-font)] text-sm transition-all duration-200 ${
                        isUploading
                          ? "text-gray-500 cursor-not-allowed opacity-50 bg-gray-200"
                          : "text-white hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)]"
                      }`}
                    >
                      {isUploading ? "Uploading..." : "Choose File"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      {!disabled && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      )}

      {/* Success Message */}
      {success && (
        <div className="text-green-600 text-sm text-center">{success}</div>
      )}

      {/* Error Message */}
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}

      {/* Upload Info */}
      <div className="text-gray-500 text-xs text-center">
        Supported formats: PDF, DOC, DOCX
        <br />
        Maximum size: 10MB
      </div>
    </div>
  );
}
