import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scrollToTop";
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
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="b8823fc7-2a15-4942-af06-bf179b7fac1a"
        ></script>
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
        <Toaster />
      </body>
    </html>
  );
}
