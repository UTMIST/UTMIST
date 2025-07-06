"use client";

import React, { useState } from "react";
import { updateUserProfile } from "@/utils/auth";
import AvatarUpload from "./AvatarUpload";
import type { UserProfile } from "@/types/auth";

interface ProfileEditFormProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function ProfileEditForm({
  profile,
  onSave,
  onCancel,
  isSaving,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    title: profile.title || "",
    bio: profile.bio || "",
    linkedin: profile.linkedin || "",
    github: profile.github || "",
    twitter: profile.twitter || "",
  });
  const [avatar, setAvatar] = useState(profile.avatar || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Update profile with avatar included
      await updateUserProfile({
        ...formData,
        avatar: avatar,
      });

      // Create updated profile object
      const updatedProfile: UserProfile = {
        ...profile,
        ...formData,
        avatar: avatar,
      };

      onSave(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ general: "Failed to update profile. Please try again." });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setAvatar(avatarUrl);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Avatar Upload Section */}
        <div className="flex justify-center">
          <AvatarUpload
            currentAvatar={avatar}
            userId={profile.id}
            onAvatarChange={handleAvatarChange}
            disabled={isSaving}
          />
        </div>



        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label
            htmlFor="linkedin"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            LinkedIn
          </label>
          <input
            type="text"
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => handleInputChange("linkedin", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="linkedin.com/in/yourusername or just your username"
          />
        </div>

        <div>
          <label
            htmlFor="github"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            GitHub
          </label>
          <input
            type="text"
            id="github"
            value={formData.github}
            onChange={(e) => handleInputChange("github", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="github.com/yourusername or just your username"
          />
        </div>

        <div>
          <label
            htmlFor="twitter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Twitter/X
          </label>
          <input
            type="text"
            id="twitter"
            value={formData.twitter}
            onChange={(e) => handleInputChange("twitter", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="twitter.com/yourusername or just your username"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              isSaving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
