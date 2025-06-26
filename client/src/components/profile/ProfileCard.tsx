"use client";

import React from "react";
import Image from "next/image";
import type { UserProfile } from "@/types/auth";

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
  // Default avatar if none provided
  const defaultAvatar = "/profile_pictures/default.webp";
  const avatarSrc = userProfile.avatar || defaultAvatar;

  // Default bio if none provided
  const defaultBio = "AI/ML enthusiast | UTMIST Member";
  const displayBio = userProfile.bio || defaultBio;

  // Display name from profile title or fallback to auth user name
  const displayName = userProfile.title || userName;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          {/* <Image
            src={avatarSrc}
            alt={`${displayName}'s profile picture`}
            fill
            className="rounded-full object-cover"
            priority
          /> */}
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
