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
    return new NextResponse("Failed to fetch Umami data", { status: 500 });
  }
  const sites = await sitesRes.json();
  // If no sites, return zeros
  if (!sites) {
    console.log("No sites found in Umami");
    return NextResponse.json({
      totalVisits: 0,
      uniques: 0,
      bounceRate: 0,
      avgTime: 0,
    });
  }
  const siteId = sites.data[0].id;

  // Fetch stats for the last 30 days using millisecond timestamps
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago in ms

  const startAt = thirtyDaysAgo.getTime(); // e.g., 1750000000000
  const endAt = now.getTime(); // current time in ms

  const statsRes = await fetch(
    `${UMAMI_API_ENDPOINT}/websites/${siteId}/stats?startAt=${startAt}&endAt=${endAt}&unit=day&timezone=UTC`,
    {
      headers: {
        Accept: "application/json",
        "x-umami-api-key": UMAMI_API_KEY,
      },
    }
  );

  if (!statsRes.ok) {
    return new NextResponse("Failed to fetch Umami data", { status: 500 });
  }
  const stats = await statsRes.json();

  // 3) Return only the fields your dashboard needs
  return NextResponse.json({
    totalVisits: stats.pageviews.value,
    uniques: stats.visitors.value,
    bounceRate: stats.visits.value
      ? stats.bounces.value / stats.visits.value
      : 0,
    avgTime: stats.visits.value
      ? stats.totaltime.value / stats.visits.value
      : 0,
  });
}
