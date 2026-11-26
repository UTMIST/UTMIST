// src/shared/lib/server.ts — server-only platform API
export { createClient } from "./supabase/server";
export { updateSession } from "./supabase/middleware";
export * from "./auth/guards";
export * from "./flags/server";
export { isWebRedesignEnabled } from "./flags/web-redesign";
export { requireCmsAccess, withCmsAccess } from "./flags/cms";
export { readCmsContent } from "./content/cms";
export { payloadPageReader } from "./content/payload";
