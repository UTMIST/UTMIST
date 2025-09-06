import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This will refresh the session if it's expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/") && !user) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Allow access to auth callback route
  if (pathname === "/auth/callback") {
    return response;
  }

  // Redirect authenticated users away from auth page
  if (pathname === "/auth" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users away from protected routes
  if (pathname === "/dashboard" && !user) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Check if user is admin for admin routes
  if (pathname === "/admin") {
    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Query Supabase user table for admin status
    const { data: userRow, error } = await supabase
      .from("user")
      .select("admin")
      .eq("id", user.id)
      .single();

    if (error || !userRow?.admin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
