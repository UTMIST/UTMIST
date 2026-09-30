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

import type { Metadata } from "next";
import { cache } from "react";
import conferencePhoto from "@/assets/photos/eigenai-conference.webp";
import { evaluateFlag } from "@/shared/lib/server";
import { Footer } from "@/shared/ui";
import { FloatingThemeToggle, Navbar } from "@/shared/ui/client";

import EigenAIPage from "./eigenai";
import EigenAIRedesign from "./eigenaiRedesign";

// Metadata and page content must agree even if the provider changes during a
// request. React's cache is request-scoped, so it does not delay later toggles.
const showEigenAIRedesign = cache(() => evaluateFlag("Eigen-AI-Redesign"));

export async function generateMetadata(): Promise<Metadata> {
  if (!(await showEigenAIRedesign())) return {};

  const title = "EigenAI 2026 | UTMIST";
  const description =
    "Join UTMIST at OISE, University of Toronto, October 3–4, 2026 for two days of AI workshops, panels, research, and networking.";
  const url = "https://www.utmist.ca/eigenai";
  const image = {
    url: new URL(conferencePhoto.src, url).href,
    width: conferencePhoto.width,
    height: conferencePhoto.height,
    alt: "Panelists and attendees at a past EigenAI conference.",
  };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: "UTMIST",
      title,
      description,
      url,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function EigenAIFlagged() {
  // This environment-wide toggle needs no user/profile lookup. Use the same
  // anonymous context as the layout so SDK evaluations dedupe.
  const showRedesign = await showEigenAIRedesign();

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
