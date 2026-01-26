"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeCardProps {
  linkedin?: string;
}

export default function QRCodeCard({ linkedin }: QRCodeCardProps) {
  if (!linkedin) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Scan to Connect
        </h2>
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-center p-4">
              Add your LinkedIn profile to generate a QR code
            </p>
          </div>
          <p className="mt-4 text-gray-600 text-center">
            Update your profile to add your LinkedIn URL
          </p>
        </div>
      </div>
    );
  }

  // Ensure the LinkedIn URL has a proper protocol
  const getLinkedInUrl = (input: string) => {
    if (!input) return "";

    // If it already has http/https, use as is
    if (input.startsWith("http://") || input.startsWith("https://")) {
      return input;
    }

    // If it starts with linkedin.com, add https
    if (input.startsWith("linkedin.com/")) {
      return `https://${input}`;
    }

    // If it's just a username, construct the full URL
    if (!input.includes("/")) {
      return `https://linkedin.com/in/${input}`;
    }

    // Default: add https
    return `https://${input}`;
  };

  const linkedinUrl = getLinkedInUrl(linkedin);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Scan to Connect
      </h2>
      <div className="flex flex-col items-center">
        <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border border-gray-200">
          <QRCodeSVG
            value={linkedinUrl}
            size={180}
            level="M"
            includeMargin={true}
            className="rounded-lg"
          />
        </div>
        <p className="mt-4 text-gray-600 text-center">
          Scan this QR code to connect on LinkedIn
        </p>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mt-2 text-sm"
        >
          View LinkedIn Profile
        </a>
      </div>
    </div>
  );
}
