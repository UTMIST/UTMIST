"use client";

import { useState, useEffect } from "react";

type Overview = {
  totalVisits: number;
  uniques: number;
  bounceRate: number;
  avgTime: number;
};

export default function AdminPageClient() {
  const [ov, setOv] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/umami/overview")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(setOv)
      .catch((e) => {
        console.error("Failed to load metrics:", e);
        setError("Failed to fetch analytics data. Please try again later.");
      });
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <h2 className="text-lg font-semibold">Analytics Unavailable</h2>
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-1 text-gray-400">
          Check your network connection or try refreshing the page.
        </p>
      </div>
    );
  }
  if (!ov) return <p className="text-center">Loading analytics data…</p>;

  return (
    <div className="bg-white text-black py-6">
      <div className="max-w-screen-xl mx-auto px-12 lg:px-12">
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="mb-8 text-gray-600">
          Website analytics and engagement metrics
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Site Visits"
            value={ov.totalVisits.toLocaleString()}
            subtext="Last 30 days"
          />
          <MetricCard
            title="Unique Visitors"
            value={ov.uniques.toLocaleString()}
            subtext="Last 30 days"
          />
          <MetricCard
            title="Bounce Rate"
            value={`${(ov.bounceRate * 100).toFixed(1)}%`}
            subtext="% of sessions"
          />
          <MetricCard
            title="Avg. Time on Page"
            value={`${(ov.avgTime / 1000).toFixed(1)}s`}
            subtext="Average session length"
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtext,
}: {
  title: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow">
      <h3 className="text-md font-semibold mb-1">{title}</h3>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtext}</p>
    </div>
  );
}
