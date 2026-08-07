import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/auth";

/**
 * Server-side access guards.
 *
 * Any surface that exposes applicant data (names, emails, phone numbers,
 * addresses, resumes, essay answers) must sit behind `requireAdmin` in a
 * server component, or `getAdminUser` in a route handler. Middleware alone
 * is not sufficient — it only distinguishes signed-in from signed-out.
 */

async function loadProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;

  return profile as UserProfile;
}

/** The signed-in user's profile row, or null. For route handlers. */
export async function getCurrentUser(): Promise<UserProfile | null> {
  return loadProfile();
}

/** The signed-in user's profile row, but only if they are an admin. For route handlers. */
export async function getAdminUser(): Promise<UserProfile | null> {
  const profile = await loadProfile();
  return profile?.admin ? profile : null;
}

/** The signed-in user's profile row, redirecting to /auth if absent. For server components. */
export async function requireUser(): Promise<UserProfile> {
  const profile = await loadProfile();
  if (!profile) redirect("/auth");
  return profile;
}

/** The signed-in user's profile row, redirecting to /auth unless they are an admin. For server components. */
export async function requireAdmin(): Promise<UserProfile> {
  const profile = await loadProfile();
  if (!profile?.admin) redirect("/auth");
  return profile;
}
