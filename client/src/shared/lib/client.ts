// src/shared/lib/client.ts — browser platform API
export { supabase, createSupabaseBrowserClient } from "./supabase/client";
export * from "./auth/client";
export * from "./auth/user";
export * from "./storage/upload";
export { useUser } from "./hooks/useUser";
