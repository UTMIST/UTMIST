import { NextResponse, type NextRequest } from "next/server";
import { evaluateFlag, updateSession } from "@/shared/lib/server";

export async function middleware(request: NextRequest) {
  const sessionResponse = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isCmsPage = pathname === "/cms" || pathname.startsWith("/cms/") ||
    pathname === "/cms-graphql-playground";

  if (
    isCmsPage && ["GET", "HEAD", "POST"].includes(request.method) &&
    !(await evaluateFlag("CMS-Access", { cohort: "public" }, request))
  ) {
    let response: NextResponse;
    if (request.method === "POST") {
      // Payload also exposes built-in actions outside our guarded callback.
      // Stop all CMS POSTs before Next dispatches either action mechanism.
      response = NextResponse.json({ error: "Not Found" }, { status: 404 });
    } else {
      // Keep frontend CSS out of Payload's route tree. This frontend page always
      // calls notFound(), while the browser keeps its original CMS URL.
      const url = request.nextUrl.clone();
      url.pathname = "/cms-unavailable";
      response = NextResponse.rewrite(url, {
        request: { headers: request.headers },
      });
    }
    for (const cookie of sessionResponse.cookies.getAll()) {
      response.cookies.set(cookie);
    }
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return sessionResponse;
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // CMS paths still need the fallback when a nested segment looks like an asset.
    "/cms/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
