"use client";

import React from "react";
import Link from "next/link";

interface AdminCardProps {
  buttonLabel?: string;
}

export default function AdminCard({
  buttonLabel = "View Analytics Page",
}: AdminCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Admin</h2>
      <div className="flex justify-center">
        <Link
          href="/admin"
          className="bg-gradient-to-r from-red-600 to-red-400 px-6 py-2 rounded-lg font-[var(--system-font)] text-white hover:opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] transition-all duration-200"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}
