"use client";

import React from "react";
import ProfileCard from "@/components/profile/ProfileCard";
import SocialCard from "@/components/profile/SocialCard";
import QRCodeCard from "@/components/profile/QRCodeCard";

// Mock user data - replace with actual user data from your auth system
const user = {
  fullName: "John Doe",
  avatar: "/placeholder-avatar.png", // Replace with actual avatar path
  bio: "AI/ML enthusiast | Software Developer | UTMIST Member",
  socials: {
    linkedin: "https://linkedin.com/in/johndoe",
    x: "https://x.com/johndoe",
    github: "https://github.com/johndoe",
  },
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <ProfileCard
          fullName={user.fullName}
          avatar={user.avatar}
          bio={user.bio}
        />

        <SocialCard socials={user.socials} />

        <QRCodeCard linkedinUrl={user.socials.linkedin} />
      </div>
    </div>
  );
}
