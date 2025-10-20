"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { uploadFile, deleteFile } from "@/utils/upload";
import { updateUserProfile } from "@/utils/user";

interface AvatarUploadProps {
  currentAvatar?: string;
  userId: string;
  disabled?: boolean;
  onAvatarChange?: (newAvatarUrl: string) => void;
}

export default function AvatarUpload({
  currentAvatar,
  userId,
  disabled = false,
  onAvatarChange,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentAvatar);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const filePath = `profile/${userId}/avatar`;
      const result = await uploadFile(file, filePath, {
        allowedTypes: ["image/"],
        maxSize: 5 * 1024 * 1024, // 5MB
        updateUserProfile: true,
      });

      if (result.success && result.url) {
        setAvatarUrl(result.url);
        await updateUserProfile(userId, { avatar: result.url });
        onAvatarChange?.(result.url);
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

  const handleRemoveAvatar = async () => {
    if (!currentAvatar || currentAvatar.includes("default.webp")) return;

    setIsUploading(true);
    setError(null);

    try {
      const success = await deleteFile("profile/" + userId + "/avatar");
      if (success) {
        const emptyUrl = "";
        setAvatarUrl(emptyUrl);
        await updateUserProfile(userId, { avatar: emptyUrl });
        onAvatarChange?.(emptyUrl);
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

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative w-32 h-32">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile avatar"
            fill
            className="rounded-full object-cover border-4 border-gray-200"
            priority
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
      {!disabled && avatarUrl && (
        <button
          type="button"
          onClick={handleRemoveAvatar}
          disabled={isUploading}
          style={isUploading ? {} : { background: "var(--gradient-b2)" }}
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
        Supported formats: JPG, PNG, GIF, WEBP, SVG
        <br />
        Maximum size: 5MB
      </div>
    </div>
  );
}
