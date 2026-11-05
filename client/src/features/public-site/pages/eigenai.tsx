import type { Metadata } from "next";
import conferencePhoto from "@/assets/photos/eigenai-conference.webp";
import EigenAIRedesign from "@/features/public-site/pages/eigenaiRedesign";

// Keep the view's optional content prop outside Next.js's route-page contract.
export default function EigenAIPage() {
  return <EigenAIRedesign />;
}

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

export const metadata: Metadata = {
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
