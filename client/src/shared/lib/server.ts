// src/shared/lib/server.ts — server-only platform API
export { createClient } from "./supabase/server";
export { updateSession } from "./supabase/middleware";
export * from "./auth/guards";
export * from "./flags/server";
export { requireCmsAccess, withCmsAccess } from "./flags/cms";
export { payloadContentReader } from "./content/payload";
export { contentOrThrow } from "./content/reader";
