"use client";

import React from "react";
import Image from "next/image";

interface ProfileCardProps {
  fullName: string;
  avatar: string;
  bio: string;
}

export default function ProfileCard({
  fullName,
  avatar,
  bio,
}: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          <Image
            src={avatar}
            alt={`${fullName}'s profile picture`}
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{fullName}</h1>
        <p className="text-gray-600 text-center">{bio}</p>
      </div>
    </div>
  );
}
