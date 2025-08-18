"use client";

import React, { useState, useRef, useEffect } from "react";
import { getUserById } from "@/utils/user";

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
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [lastUploadDate, setLastUploadDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canUpload, setCanUpload] = useState(true);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const userProfile = await getUserById(userId);
        if (userProfile?.resume_upload) {
          const uploadDate =
            typeof userProfile.resume_upload === "string"
              ? new Date(userProfile.resume_upload)
              : userProfile.resume_upload;

          if (uploadDate && !isNaN(uploadDate.getTime())) {
            setLastUploadDate(uploadDate);
            onResumeChange?.(true);
            
            // Check if user can upload (30-minute limit)
            const now = new Date();
            const timeDiff = now.getTime() - uploadDate.getTime();
            const minutesDiff = Math.floor(timeDiff / (1000 * 60));
            
            if (minutesDiff < 30) {
              setCanUpload(false);
              setRemainingMinutes(30 - minutesDiff);
            } else {
              setCanUpload(true);
              setRemainingMinutes(0);
            }
          } else {
            onResumeChange?.(false);
            setCanUpload(true);
            setRemainingMinutes(0);
          }
        } else {
          onResumeChange?.(false);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, onResumeChange]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setError(null);
    setSuccess(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setError(null);
        setSuccess(null);
      } else {
        setError("Please select a PDF file");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/drive_upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess("Resume uploaded to Google Drive successfully!");
        setLastUploadDate(new Date());
        setCanUpload(false);
        setRemainingMinutes(30);
        onResumeChange?.(true);
      } else if (response.status === 429) {
        setError(result.error || "Upload rate limited");
        if (result.remainingMinutes) {
          setCanUpload(false);
          setRemainingMinutes(result.remainingMinutes);
        }
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

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume
        </label>

        {/* Dropbox */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            !canUpload
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : isDragOver
              ? "border-blue-400 bg-blue-50 cursor-pointer"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
          }`}
          onDrop={!canUpload ? undefined : handleDrop}
          onDragOver={!canUpload ? undefined : handleDragOver}
          onDragLeave={!canUpload ? undefined : handleDragLeave}
          onClick={() => !disabled && canUpload && fileInputRef.current?.click()}
        >
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
              <p className={`text-sm ${!canUpload ? "text-gray-400" : "text-gray-600"}`}>
                {!canUpload
                  ? `Upload limited. Try again in ${remainingMinutes} minutes.`
                  : isDragOver
                  ? "Drop your resume here"
                  : "Click to upload or drag and drop your resume here"}
              </p>
            </div>
          </div>
        </div>

        {/* Selected File Display */}
        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {selectedFile && !disabled && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading || !canUpload}
              style={isUploading || !canUpload ? {} : { background: "var(--gradient-b2)" }}
              className={`w-full px-4 py-2 rounded-lg font-[var(--system-font)] text-sm transition-all duration-200 ${
                isUploading || !canUpload
                  ? "text-gray-500 cursor-not-allowed opacity-50 bg-gray-200"
                  : "text-white hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)]"
              }`}
            >
              {isUploading 
                ? "Uploading..." 
                : !canUpload 
                ? `Wait ${remainingMinutes} minutes`
                : "Submit Resume"}
            </button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      {!disabled && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading || !canUpload}
        />
      )}

      {/* Success Message */}
      {success && (
        <div className="text-green-600 text-sm text-center">{success}</div>
      )}

      {/* Error Message */}
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}

      {lastUploadDate && !isLoading && (
        <div className="text-green-600 text-sm text-center">
          Last uploaded:{" "}
          {lastUploadDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}

      {/* Upload Info */}
      <div className="text-gray-500 text-xs text-center">
        Supported formats: PDF ONLY
        <br />
        Maximum size: 10MB
      </div>
    </div>
  );
}
