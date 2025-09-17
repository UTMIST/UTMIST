"use client";

import React, { useState } from "react";
import { updateUserProfile } from "@/utils/user";
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
    name: profile.name || "",
    title: profile.title || "",
    bio: profile.bio || "",
    linkedin: profile.linkedin || "",
    github: profile.github || "",
    twitter: profile.twitter || "",
    avatar: profile.avatar || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name is required
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
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
      // Update profile using the new user utilities
      const success = await updateUserProfile(profile.id, {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        linkedin: formData.linkedin,
        github: formData.github,
        twitter: formData.twitter,
        avatar: formData.avatar,
      });

      if (!success) {
        throw new Error("Failed to update profile");
      }

      // Create updated profile object
      const updatedProfile: UserProfile = {
        ...profile,
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        linkedin: formData.linkedin,
        github: formData.github,
        twitter: formData.twitter,
        avatar: formData.avatar,
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

  const handleAvatarChange = (newAvatarUrl: string) => {
    setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
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

        <div className="flex justify-center">
          <AvatarUpload
            currentAvatar={formData.avatar}
            userId={profile.id}
            disabled={isSaving}
            onAvatarChange={handleAvatarChange}
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Your full name"
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/*<div>*/}
        {/*  <label*/}
        {/*    htmlFor="title"*/}
        {/*    className="block text-sm font-medium text-gray-700 mb-2"*/}
        {/*  >*/}
        {/*    Title*/}
        {/*  </label>*/}
        {/*  <input*/}
        {/*    type="text"*/}
        {/*    id="title"*/}
        {/*    value={formData.title}*/}
        {/*    onChange={(e) => handleInputChange("title", e.target.value)}*/}
        {/*    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
        {/*    placeholder="Your professional title"*/}
        {/*  />*/}
        {/*</div>*/}

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
            placeholder="linkedin.com/in/yourusername"
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
            placeholder="github.com/yourusername"
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
            placeholder="x.com/yourusername"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            style={isSaving ? {} : { background: "var(--gradient-b2)" }}
            className={`flex-1 px-6 py-3 rounded-lg font-[var(--system-font)] transition-all duration-200 ${
              isSaving
                ? "text-gray-500 cursor-not-allowed opacity-50 bg-gray-200"
                : "text-white hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)]"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            style={isSaving ? {} : { background: "var(--gradient-b2)" }}
            className={`flex-1 px-6 py-3 rounded-lg font-[var(--system-font)] transition-all duration-200 ${
              isSaving
                ? "text-gray-500 cursor-not-allowed opacity-50 bg-gray-200"
                : "text-white hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)]"
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
