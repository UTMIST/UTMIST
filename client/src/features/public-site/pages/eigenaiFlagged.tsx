// src/features/public-site/pages/eigenaiFlagged.tsx
//
// Server-side selector for /eigenai (#447). It evaluates the `Eigen-AI-Redesign`
// Vercel flag on the server and renders either the existing page or the
// redesign — so the choice is made before any HTML is sent (no flash of the
// wrong page) and is never frozen at build time. The route shell re-exports
// this module's default and declares `dynamic = "force-dynamic"` itself.
//
// Default-off is guaranteed upstream by `evaluateFlag` (missing config /
// evaluation failure → `false`), so a failure keeps the existing page.

import { contextFromProfile } from "@/shared/lib";
import { evaluateFlag, getCurrentUser } from "@/shared/lib/server";

import EigenAIPage from "./eigenai";
import EigenAIRedesign from "./eigenaiRedesign";

export default async function EigenAIFlagged() {
  // Public page: read the profile if present, but never require sign-in.
  const profile = await getCurrentUser();
  const showRedesign = await evaluateFlag(
    "Eigen-AI-Redesign",
    contextFromProfile(profile),
  );

  return showRedesign ? <EigenAIRedesign /> : <EigenAIPage />;
}
