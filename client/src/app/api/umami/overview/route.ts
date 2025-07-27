import { NextResponse } from "next/server";

export async function GET() {
  const UMAMI_API_ENDPOINT = process.env.UMAMI_API_ENDPOINT!; // e.g. "https://api.umami.is/v1"
  const UMAMI_API_KEY = process.env.UMAMI_API_KEY!;

  // 1) List all sites
  const sitesRes = await fetch(`${UMAMI_API_ENDPOINT}/websites`, {
    headers: {
      Accept: "application/json",
      "x-umami-api-key": UMAMI_API_KEY,
    },
  });
  if (!sitesRes.ok) {
    return NextResponse.error();
  }
  const sites = await sitesRes.json();

  // If no sites, return zeros
  if (!sites.length) {
    console.log("No sites found in Umami");
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
  // Create a Date object representing 30 days ago from the current time
  // [number of days] * [hours in day] * [minutes in hour] * [seconds in minute] * [milliseconds in second]
  const thirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startAt = thirtyDays.toISOString();
  const endAt = now.toISOString();

  const statsRes = await fetch(
    `${UMAMI_API_ENDPOINT}/websites/${siteId}/stats?startAt=${startAt}&endAt=${endAt}`,
    {
      headers: {
        Accept: "application/json",
        "x-umami-api-key": UMAMI_API_KEY,
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
