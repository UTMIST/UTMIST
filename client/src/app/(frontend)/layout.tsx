import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { Footer } from "@/shared/ui";
import {
  Navbar,
  ScrollToTop,
  FloatingThemeToggle,
  HideOnEigenAI,
  ThemeProvider,
} from "@/shared/ui/client";
import { Toaster } from "react-hot-toast";

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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="b8823fc7-2a15-4942-af06-bf179b7fac1a"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HideOnEigenAI>
            <Navbar />
          </HideOnEigenAI>
          {children}
          <HideOnEigenAI>
            <Footer />
          </HideOnEigenAI>
          <ScrollToTop />
          <HideOnEigenAI>
            <FloatingThemeToggle />
          </HideOnEigenAI>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
