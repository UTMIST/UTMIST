"use client";

export default function AdminPage() {
  return (
    <div className="bg-white text-black py-6">
      <div className="max-w-screen-xl mx-auto px-12 lg:px-12">
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="mb-8 text-gray-600">
          Website analytics and engagement metrics
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Site Visits"
            value="123123"
            subtext="Last updated: 2025-06-30 12:00 EST"
          />
          <MetricCard title="Unique Visitors" value="456" subtext="This week" />
          <MetricCard
            title="Bounce Rate"
            value="30%"
            subtext="% of visitors who left immediately"
          />
          <MetricCard
            title="Avg. Time on Page"
            value="--"
            subtext="Across all users"
          />
        </div>

        {/* Engagement Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Top Traffic Sources"
            value="--"
            subtext="Instagram, Discord, Google..."
          />
          <MetricCard
            title="Most Viewed Pages"
            value="--"
            subtext="E.g., /home, /projects, /apply"
          />
          <MetricCard
            title="Page Bounce Rate"
            value="--"
            subtext="Per-page engagement"
          />
          <MetricCard
            title="Apply Clicks"
            value="--"
            subtext="For UTMIST applications"
          />
          <MetricCard
            title="RSVP Clicks"
            value="--"
            subtext="For event participation"
          />
        </div>

        {/* Traffic Trends Placeholder */}
        <h2 className="text-xl font-semibold mb-4">Visit Trends</h2>
        <div className="bg-white border rounded-xl p-6 shadow h-64 flex items-center justify-center text-gray-500">
          <span>Placeholder Graph</span>
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
