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

import { evaluateFlag } from "@/shared/lib/server";
import { Footer } from "@/shared/ui";
import { FloatingThemeToggle, Navbar } from "@/shared/ui/client";

import EigenAIPage from "./eigenai";
import EigenAIRedesign from "./eigenaiRedesign";

export default async function EigenAIFlagged() {
  // This environment-wide toggle needs no user/profile lookup. Use the same
  // anonymous context as the layout so SDK evaluations dedupe.
  const showRedesign = await evaluateFlag("Eigen-AI-Redesign");

  if (showRedesign) return <EigenAIRedesign />;

  // The frontend layout omits its chrome on /eigenai. Restore the standard
  // controls for the legacy branch, including default-off provider failures.
  return (
    <>
      <Navbar />
      <EigenAIPage />
      <Footer />
      <FloatingThemeToggle />
    </>
  );
}
