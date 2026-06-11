"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/utils/auth";
import { getCurrentUserProfile } from "@/utils/user";
import type { UserProfile, AuthUser } from "@/types/auth";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import SocialCard from "@/components/profile/SocialCard";
import QRCodeCard from "@/components/profile/QRCodeCard";
import ResumeCard from "@/components/profile/ResumeCard";
import AdminCard from "@/components/profile/AdminCard";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current authenticated user
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // Redirect to auth page if not authenticated
          router.push("/auth");
          return;
        }

        setUser(currentUser);
        console.log("currentUser", currentUser);
        // Get full user profile from public.user table
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleSave = async (updatedProfile: UserProfile) => {
    setIsSaving(true);
    try {
      // The actual save is handled in the ProfileEditForm component
      handleSaveProfile(updatedProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "var(--gradient-b2)" }}
            className="px-4 py-2 rounded-lg font-[var(--system-font)] text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show profile if user is authenticated
  if (user && profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {isEditing ? (
            <ProfileEditForm
              profile={profile}
              onSave={handleSave}
              onCancel={handleCancelEdit}
              isSaving={isSaving}
            />
          ) : (
            <ProfileCard
              userProfile={profile}
              onEdit={handleEditProfile}
              onLogout={handleLogout}
              isEditing={isEditing}
            />
          )}

          <SocialCard
            linkedin={profile.linkedin}
            github={profile.github}
            twitter={profile.twitter}
          />

          <ResumeCard
            userId={profile.id}
            year={profile.year}
            name={profile.name}
          />

          <QRCodeCard linkedin={profile.linkedin} />

          {profile.admin ? <AdminCard /> : null}
        </div>
      </div>
    );
  }

  // Fallback - should not reach here if authentication is working properly
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Profile Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          Unable to load your profile information.
        </p>
        <button
          onClick={() => router.push("/auth")}
          style={{ background: "var(--gradient-b2)" }}
          className="px-4 py-2 rounded-lg font-[var(--system-font)] text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)]"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
