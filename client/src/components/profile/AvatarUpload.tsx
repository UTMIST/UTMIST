"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { uploadAvatar, deleteAvatar } from "@/utils/upload";
import { getDisplayAvatarUrl } from "@/utils/avatar";

interface AvatarUploadProps {
  currentAvatar?: string;
  userId: string;
  onAvatarChange: (avatarUrl: string) => void;
  disabled?: boolean;
}

export default function AvatarUpload({
  currentAvatar,
  userId,
  onAvatarChange,
  disabled = false,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [displayAvatar, setDisplayAvatar] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load the current avatar
  useEffect(() => {
    const loadCurrentAvatar = async () => {
      try {
        const avatarUrl = await getDisplayAvatarUrl(userId);
        setDisplayAvatar(avatarUrl);
      } catch (error) {
        console.error("Error loading current avatar:", error);
        setDisplayAvatar("");
      }
    };

    if (userId) {
      loadCurrentAvatar();
    }
  }, [userId]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError(null);

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadAvatar(file, userId);

      if (result.success && result.url) {
        // Delete old avatar if it exists
        if (currentAvatar && !currentAvatar.includes("default.webp")) {
          await deleteAvatar(userId);
        }

        // Update parent component
        onAvatarChange(result.url);

        // Update local display
        setDisplayAvatar(result.url);

        // Clear preview
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      } else {
        setError(result.error || "Upload failed");
        // Clear preview on error
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("An unexpected error occurred");
      // Clear preview on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatar || currentAvatar.includes("default.webp")) return;

    setIsUploading(true);
    setError(null);

    try {
      const success = await deleteAvatar(userId);
      if (success) {
        const emptyUrl = "";
        onAvatarChange(emptyUrl);
        setDisplayAvatar(emptyUrl);
      } else {
        setError("Failed to remove avatar");
      }
    } catch (error) {
      console.error("Remove avatar error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const showAvatar = previewUrl || displayAvatar;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative w-32 h-32">
        {showAvatar ? (
          <Image
            src={showAvatar}
            alt="Profile avatar"
            fill
            className="rounded-full object-cover border-4 border-gray-200"
            priority
            onError={() => {
              console.error("Failed to load avatar image");
              setDisplayAvatar("");
            }}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 border-4 border-gray-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Upload Overlay */}
        {!disabled && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-white text-sm font-medium">
              {isUploading ? "Uploading..." : "Change Photo"}
            </span>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      {!disabled && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      )}

      {/* Remove button (only show if avatar exists and not default) */}
      {!disabled &&
        currentAvatar &&
        !currentAvatar.includes("default.webp") && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            disabled={isUploading}
            style={isUploading ? {} : { background: 'var(--gradient-b2)' }}
            className={`px-3 py-1 rounded-lg font-[var(--system-font)] text-xs transition-all duration-200 ${
              isUploading
                ? "text-gray-500 cursor-not-allowed opacity-50 bg-gray-200"
                : "text-white hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)]"
            }`}
          >
            {isUploading ? "Removing..." : "Remove Photo"}
          </button>
        )}

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm text-center max-w-xs">{error}</div>
      )}

      {/* Upload Info */}
      <div className="text-gray-500 text-xs text-center max-w-xs">
        Supported formats: JPG, PNG, GIF
        <br />
        Maximum size: 5MB
      </div>
    </div>
  );
}
