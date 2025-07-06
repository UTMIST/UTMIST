"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { UserProfile } from "@/types/auth";
import { getDisplayAvatarUrl } from "@/utils/avatar";

interface ProfileCardProps {
  userProfile: UserProfile;
  userEmail: string;
  userName: string;
  onEdit?: () => void;
  isEditing?: boolean;
}

export default function ProfileCard({
  userProfile,
  userEmail,
  userName,
  onEdit,
  isEditing = false,
}: ProfileCardProps) {
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState(true);

  // Load avatar URL
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        setAvatarLoading(true);
        const avatarUrl = await getDisplayAvatarUrl(userProfile.id);
        setAvatarSrc(avatarUrl);
      } catch (error) {
        console.error("Error loading avatar:", error);
        setAvatarSrc("");
      } finally {
        setAvatarLoading(false);
      }
    };

    if (userProfile.id) {
      loadAvatar();
    }
  }, [userProfile.id]);

  // Default bio if none provided
  const defaultBio = "";
  const displayBio = userProfile.bio || defaultBio;

  // Display name from profile title or fallback to auth user name
  const displayName = userProfile.title || userName;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          {avatarLoading ? (
            <div className="w-full h-full rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={`${displayName}'s profile picture`}
              fill
              className="rounded-full object-cover border-4 border-gray-200"
              priority
              onError={() => {
                setAvatarSrc("");
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
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
        <p className="text-gray-500 text-sm mb-3">{userEmail}</p>
        <p className="text-gray-600 text-center mb-4">{displayBio}</p>

        {onEdit && (
          <button
            onClick={onEdit}
            disabled={isEditing}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isEditing
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Editing..." : "Edit Profile"}
          </button>
        )}
      </div>
    </div>
  );
}
