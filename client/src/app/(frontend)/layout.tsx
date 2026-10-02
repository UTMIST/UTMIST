import type { Metadata } from "next";
import Script from "next/script";
import { VercelToolbar } from "@vercel/toolbar/next";
import "../globals.css";
import { Footer } from "@/shared/ui";
import {
  Navbar,
  ScrollToTop,
  HideOnEigenAI,
} from "@/shared/ui/client";
import { Toaster } from "react-hot-toast";
import { evaluateFlag } from "@/shared/lib/server";

//Metadata for the page
export const metadata: Metadata = {
  title: "UTMIST",
    icons: {
    icon: "/UTMIST.ico",
  },
  description: "University of Toronto Machine Intelligence Student Team",
};

// Root layout for the application
// This layout wraps around all pages and includes the Navbar and Footer
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showEigenAI = await evaluateFlag("Eigen-AI-Redesign");
  // Vercel injects its own toolbar on Preview deployments.
  const showLocalToolbar =
    process.env.NODE_ENV === "development" &&
    process.env.VERCEL_ENV !== "production";

  return (
    <html lang="en">
      <head>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="b8823fc7-2a15-4942-af06-bf179b7fac1a"
        />
      </head>
      <body className="antialiased">
        <HideOnEigenAI>
          <Navbar showEigenAI={showEigenAI} />
        </HideOnEigenAI>
        {children}
        <HideOnEigenAI>
          <Footer />
        </HideOnEigenAI>
        <ScrollToTop />
        <Toaster />
        {showLocalToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
