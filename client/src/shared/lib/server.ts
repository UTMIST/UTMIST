// src/shared/lib/server.ts — server-only platform API
export { createClient } from "./supabase/server";
export { updateSession } from "./supabase/middleware";
export * from "./auth/guards";
