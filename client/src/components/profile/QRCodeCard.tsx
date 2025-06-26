"use client";

import React from "react";

interface QRCodeCardProps {
  linkedin?: string;
}

export default function QRCodeCard({ linkedin }: QRCodeCardProps) {
  if (!linkedin) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Scan to Connect
      </h2>
      <div className="flex flex-col items-center">
        {/* Placeholder for QR Code - Replace with actual QR code component after installing qrcode.react */}
        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-center p-4">
            QR Code Placeholder
            <br />
            (Install qrcode.react to enable)
            <br />
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 block"
            >
              View LinkedIn Profile
            </a>
          </p>
        </div>
        <p className="mt-4 text-gray-600 text-center">
          Scan this QR code to connect on LinkedIn
        </p>
      </div>
    </div>
  );
}
