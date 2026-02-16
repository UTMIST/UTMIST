"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import AddCalendly from "./AddCalendly";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type TimeSeriesPoint = { x: string; y: number };

type DashboardData = {
  summary: {
    pageviews: number;
    visitors: number;
    visits: number;
    bounceRate: number;
    avgTime: number;
  };
  chart: {
    pageviews: TimeSeriesPoint[];
  };
  tables: {
    pages: { x: string; y: number }[];
    referrers: { x: string; y: number }[];
    browsers: { x: string; y: number }[];
    os: { x: string; y: number }[];
    devices: { x: string; y: number }[];
    countries: { x: string; y: number }[];
  };
};

export default function AdminPageClient({
  userId,
  calendly,
}: {
  userId: string;
  calendly: string;
}) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [range, setRange] = useState<string>("30d");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/umami/overview?range=${range}`);
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setData({
          summary: {
            pageviews: Number(data?.summary?.pageviews) || 0,
            visitors: Number(data?.summary?.visitors) || 0,
            visits: Number(data?.summary?.visits) || 0,
            bounceRate: Number(data?.summary?.bounceRate) || 0,
            avgTime: Number(data?.summary?.avgTime) || 0,
          },
          chart: {
            pageviews: Array.isArray(data?.chart?.pageviews)
              ? data.chart.pageviews
              : [],
          },
          tables: {
            pages: Array.isArray(data?.tables?.pages) ? data.tables.pages : [],
            referrers: Array.isArray(data?.tables?.referrers)
              ? data.tables.referrers
              : [],
            browsers: Array.isArray(data?.tables?.browsers)
              ? data.tables.browsers
              : [],
            os: Array.isArray(data?.tables?.os) ? data.tables.os : [],
            devices: Array.isArray(data?.tables?.devices)
              ? data.tables.devices
              : [],
            countries: Array.isArray(data?.tables?.countries)
              ? data.tables.countries
              : [],
          },
        });
      } catch (e) {
        console.error("Failed to load metrics:", e);
        setError("Failed to fetch analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [range]);

  if (error) {
    return (
      <StateSection>
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-red-500">
            Analytics Unavailable
          </h2>
          <p className="text-sm text-gray-700">{error}</p>
          <p className="text-xs text-gray-400">
            Check your network connection or try refreshing the page.
          </p>
        </div>
      </StateSection>
    );
  }
  if (loading) {
    return (
      <StateSection>
        <div className="text-center space-y-2">
          <p className="text-base font-medium text-gray-700 animate-pulse">
            Loading analytics data…
          </p>
          <p className="text-xs text-gray-400">
            Hang tight while we fetch the latest metrics.
          </p>
        </div>
      </StateSection>
    );
  }
  if (!data) {
    return (
      <StateSection>
        <p className="text-center text-red-500 text-sm">
          Analytics data unavailable. Please try again later.
        </p>
      </StateSection>
    );
  }

  return (
    <div className="bg-white text-black pt-24 pb-8 sm:pt-12 sm:pb-10">
      <div className="max-w-screen-xl mx-auto px-12 lg:px-12">
        <AddCalendly userId={userId} calendly={calendly} />

        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <p className="text-gray-600">
            Website analytics and engagement metrics
          </p>
          <label className="inline-flex items-center gap-2 text-sm">
            <span className="text-gray-600">Range:</span>
            <div className="relative">
              <select
                className="border rounded pl-2 pr-12 py-1 text-sm appearance-none"
                value={range}
                onChange={(e) => setRange(e.target.value)}
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="180d">Last 6 months</option>
                <option value="365d">Last 12 months</option>
                <option value="all">All time</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    d="M6 8l4 4 4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard
            title="Views"
            value={data.summary.pageviews.toLocaleString()}
            subtext="Total pageviews"
          />
          <MetricCard
            title="Visits"
            value={data.summary.visits.toLocaleString()}
            subtext="Sessions"
          />
          <MetricCard
            title="Visitors"
            value={data.summary.visitors.toLocaleString()}
            subtext="Unique visitors"
          />
          <MetricCard
            title="Bounce Rate"
            value={`${(data.summary.bounceRate * 100).toFixed(1)}%`}
            subtext="% of sessions"
          />
          <MetricCard
            title="Visit duration"
            value={`${(data.summary.avgTime / 1000).toFixed(1)}s`}
            subtext="Average session length"
          />
        </div>

        <TimeSeriesCard series={data.chart.pageviews} range={range} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableCard title="Pages" rows={data.tables.pages} />
          <TableCard title="Sources" rows={data.tables.referrers} />
          <TableCard title="Environment" rows={data.tables.browsers} />
          <TableCard title="OS" rows={data.tables.os} />
          <TableCard title="Devices" rows={data.tables.devices} />
          <TableCard title="Location" rows={data.tables.countries} />
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

function TableCard({
  title,
  rows,
}: {
  title: string;
  rows: { x: string; y: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.y), 1);
  return (
    <div className="bg-white border rounded-xl p-4 shadow">
      <h3 className="text-md font-semibold mb-3">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">No data</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row, idx) => (
            <li key={`${row.x}-${idx}`}>
              <div className="flex justify-between text-sm">
                <span className="truncate max-w-[70%]">{row.x || "-"}</span>
                <span className="font-semibold">{row.y}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${(row.y / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TimeSeriesCard({
  series,
  range,
}: {
  series: TimeSeriesPoint[];
  range: string;
}) {
  if (!series.length) {
    return (
      <div className="bg-white border rounded-xl p-4 shadow mb-6">
        <h3 className="text-md font-semibold mb-3">Traffic</h3>
        <p className="text-sm text-gray-500">No time series data.</p>
      </div>
    );
  }
  const labels = series.map((p) =>
    range === "24h"
      ? new Date(p.x).toLocaleTimeString([], { hour: "numeric" })
      : new Date(p.x).toLocaleDateString([], { month: "short", day: "numeric" })
  );
  const chartData = {
    labels,
    datasets: [
      {
        label: "Pageviews",
        data: series.map((p) => p.y),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderRadius: 4,
        barThickness: "flex" as const,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, minRotation: 0, autoSkip: true },
      },
      y: {
        grid: { color: "#eee" },
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow mb-6 h-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold">Traffic</h3>
        <span className="text-sm text-gray-500">Pageviews</span>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}

function StateSection({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white text-black pt-24 pb-8 sm:pt-12 sm:pb-10 min-h-[70vh] flex items-center justify-center px-6">
      {children}
    </div>
  );
}
