import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") ?? "30d";
  const ranges: Record<string, number> = {
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
    "90d": 90 * 24 * 60 * 60 * 1000,
    "180d": 180 * 24 * 60 * 60 * 1000,
    "365d": 365 * 24 * 60 * 60 * 1000,
    all: Date.now(), // effectively from epoch
  };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth"));
  }

  const { data: userRow, error } = await supabase
    .from("user")
    .select("admin")
    .eq("id", user.id)
    .single();

  if (error || !userRow?.admin) {
    return NextResponse.redirect(new URL("/auth"));
  }
  const UMAMI_API_ENDPOINT = process.env.UMAMI_API_ENDPOINT!; // e.g. "https://api.umami.is/v1"
  const UMAMI_API_KEY = process.env.UMAMI_API_KEY!;
  const headers = {
    Accept: "application/json",
    "x-umami-api-key": UMAMI_API_KEY,
  };

  // 1) List all sites
  const sitesRes = await fetch(`${UMAMI_API_ENDPOINT}/websites`, { headers });
  if (!sitesRes.ok) {
    return new NextResponse("Failed to fetch Umami data", { status: 500 });
  }
  const sites = await sitesRes.json();
  // Umami responses can be either { data: [...] } or an array directly
  const firstSite = Array.isArray(sites) ? sites?.[0] : sites?.data?.[0];
  const siteId = firstSite?.id ?? firstSite?.websiteId;
  if (!siteId) {
    console.log("No sites found in Umami");
    return NextResponse.json({
      totalVisits: 0,
      uniques: 0,
      bounceRate: 0,
      avgTime: 0,
    });
  }

  // Fetch stats for the requested range using millisecond timestamps
  const now = Date.now();
  const span = ranges[range] ?? ranges["30d"];
  const startAt = range === "all" ? 0 : now - span;
  const endAt = now;
  const unit = range === "24h" ? "hour" : "day";

  const statsRes = await fetch(
    `${UMAMI_API_ENDPOINT}/websites/${siteId}/stats?startAt=${startAt}&endAt=${endAt}&unit=${unit}&timezone=UTC`,
    { headers }
  );

  if (!statsRes.ok) {
    return new NextResponse("Failed to fetch Umami data", { status: 500 });
  }
  const stats = await statsRes.json();

  const pageviews = stats?.pageviews?.value ?? stats?.pageviews ?? 0;
  const visitors = stats?.visitors?.value ?? stats?.visitors ?? 0;
  const visits = stats?.visits?.value ?? stats?.visits ?? 0;
  const bounces = stats?.bounces?.value ?? stats?.bounces ?? 0;
  const totaltime = stats?.totaltime?.value ?? stats?.totaltime ?? 0;

  // Fetch pageview time series and top metrics in parallel
  const getMetrics = async (type: string, limit = 10) => {
    const res = await fetch(
      `${UMAMI_API_ENDPOINT}/websites/${siteId}/metrics?type=${type}&startAt=${startAt}&endAt=${endAt}&limit=${limit}`,
      { headers }
    );
    if (!res.ok) {
      console.warn(`Failed to fetch metrics ${type}`, res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : data ?? [];
  };

  const [pageviewsSeriesRes, pages, referrers, browsers, os, devices, countries] =
    await Promise.all([
      fetch(
        `${UMAMI_API_ENDPOINT}/websites/${siteId}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=${unit}&timezone=UTC`,
        { headers }
      ).then(async (r) => {
        if (!r.ok) {
          console.warn("Failed to fetch pageviews series", r.status);
          return { pageviews: [] };
        }
        return r.json();
      }),
      getMetrics("url"),
      getMetrics("referrer"),
      getMetrics("browser"),
      getMetrics("os"),
      getMetrics("device"),
      getMetrics("country"),
    ]);

  const pageviewsSeries = pageviewsSeriesRes?.pageviews ?? [];

  // 3) Return the dashboard payload
  return NextResponse.json({
    summary: {
      pageviews,
      visitors,
      visits,
      bounceRate: visits > 0 ? bounces / visits : 0,
      avgTime: visits > 0 ? totaltime / visits : 0,
    },
    chart: {
      pageviews: pageviewsSeries,
    },
    tables: {
      pages,
      referrers,
      browsers,
      os,
      devices,
      countries,
    },
  });
}
