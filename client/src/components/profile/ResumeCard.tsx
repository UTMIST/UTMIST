"use client";

import React from "react";
import ResumeUpload from "./ResumeUpload";

interface ResumeCardProps {
  userId: string;
}

export default function ResumeCard({ userId }: ResumeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Resume</h2>
      <ResumeUpload
        userId={userId}
        onResumeChange={() => {}}
        disabled={false}
      />
    </div>
  );
}