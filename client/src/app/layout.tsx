import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingThemeToggle } from "@/components/floating-theme-toggle";
import { Roboto, Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";

// Importing fonts from Google Fonts
const roboto = Roboto({
  weight: ["300", "400", "500", "700"], // Added specific weights
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

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
      <body
        className={`${roboto.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
          <FloatingThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
