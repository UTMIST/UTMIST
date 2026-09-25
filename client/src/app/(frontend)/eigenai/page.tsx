export { default } from "@/features/public-site/pages/eigenaiFlagged";

// Declared here (not re-exported) because Next.js only reads route segment
// config from the route file, and Turbopack requires it to be a statically
// parseable literal. `force-dynamic` evaluates the flag per request, so a
// dashboard toggle takes effect without a redeploy.
export const dynamic = "force-dynamic";
