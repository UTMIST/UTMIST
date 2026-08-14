"use client";

import React from "react";
import ResumeUpload from "./ResumeUpload";

interface ResumeCardProps {
  userId: string;
  year?: string;
  name?: string;
}

export default function ResumeCard({ userId, year, name }: ResumeCardProps) {
  const missingYear = !year;
  const missingName = !name || name.trim() === "";
  const isDisabled = missingYear || missingName;

  const getWarningMessage = () => {
    if (missingName && missingYear) {
      return "Please update your name and year in the profile section above before uploading your resume.";
    } else if (missingName) {
      return "Please update your name in the profile section above before uploading your resume.";
    } else if (missingYear) {
      return "Please update your year in the profile section above before uploading your resume.";
    }
    return "";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Resume</h2>
      {isDisabled && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            {getWarningMessage()}
          </p>
        </div>
      )}
      <ResumeUpload
        userId={userId}
        onResumeChange={() => {}}
        disabled={isDisabled}
      />
    </div>
  );
}