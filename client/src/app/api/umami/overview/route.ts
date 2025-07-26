import { NextResponse } from "next/server";

export async function GET() {
  const API_ENDPOINT = process.env.UMAMI_API_ENDPOINT!; // e.g. "https://api.umami.is/v1"
  const API_KEY = process.env.UMAMI_API_KEY!;

  // 1) List all sites
  const sitesRes = await fetch(`${API_ENDPOINT}/websites`, {
    headers: {
      Accept: "application/json",
      "x-umami-api-key": API_KEY,
    },
  });
  if (!sitesRes.ok) {
    return NextResponse.error();
  }
  const sites = await sitesRes.json();

  // If no sites, return zeros
  if (!sites.length) {
    return NextResponse.json({
      totalVisits: 0,
      uniques: 0,
      bounceRate: 0,
      avgTime: 0,
    });
  }

  const siteId = sites[0].id;

  // 2) Fetch stats for the last 30 days
  const now = new Date();
  const thirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startAt = thirtyDays.toISOString();
  const endAt = now.toISOString();

  const statsRes = await fetch(
    `${API_ENDPOINT}/websites/${siteId}/stats?startAt=${startAt}&endAt=${endAt}`,
    {
      headers: {
        Accept: "application/json",
        "x-umami-api-key": API_KEY,
      },
    }
  );
  if (!statsRes.ok) {
    return NextResponse.error();
  }
  const stats = await statsRes.json();

  // 3) Return only the fields your dashboard needs
  return NextResponse.json({
    totalVisits: stats.pageviews,
    uniques: stats.uniques,
    bounceRate: stats.bounces / stats.sessions,
    avgTime: stats.sessions ? stats.totaltime / stats.sessions : 0,
  });
}
