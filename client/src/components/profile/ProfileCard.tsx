"use client";

import React from "react";
import Image from "next/image";
import type { UserProfile } from "@/types/auth";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  userProfile: UserProfile;
  onEdit?: () => void;
  onLogout?: () => void;
  isEditing?: boolean;
}

export default function ProfileCard({
  userProfile,
  onEdit,
  onLogout,
  isEditing = false,
}: ProfileCardProps) {
  const noNameWarning = "please update your name";
  const defaultBio = "please update your bio";
  const displayBio = userProfile.bio || defaultBio;

  const displayName = userProfile.title || userProfile.name || noNameWarning;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          {userProfile.avatar && (
            <Image
              src={userProfile.avatar}
              alt={`${displayName}'s profile picture`}
              fill
              className="rounded-full object-cover border-4 border-gray-200"
              priority
            />
          )}
          {!userProfile.avatar && (
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
        {displayName === noNameWarning ? (
          <p className="text-red-500 text-3xl mb-3">Please update your name</p>
        ) : (
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {displayName}
          </h1>
        )}
        <p className="text-gray-500 text-sm mb-3">{userProfile.email}</p>
        <p className="text-gray-600 text-center mb-4">{displayBio}</p>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {onEdit && (
            <Button
              onClick={onEdit}
              disabled={isEditing}
              variant={isEditing ? "ghost" : "default"}
              className={`px-6 py-2 font-[var(--system-font)] ${
                isEditing
                  ? "text-gray-500 cursor-not-allowed opacity-50 bg-gray-200"
                  : ""
              }`}
            >
              {isEditing ? "Editing..." : "Edit Profile"}
            </Button>
          )}
          {onLogout && (
            <Button
              onClick={onLogout}
              variant="destructive"
              className="px-6 py-2 font-[var(--system-font)] bg-gradient-to-r from-red-600 to-red-400 border-0"
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
