import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Roboto, Space_Grotesk } from "next/font/google";

// Importing fonts from Google Fonts
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],  // Added specific weights
  variable: "--font-roboto",
  subsets: ["latin"],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

//Metadata for the page
export const metadata: Metadata = {
  title: "UTMIST",
  description: "UTMIST - Largest AI and ML student org in Canada",
  icons: {
    icon: "/UTMIST.ico",
  },
};

// Root layout for the application
// This layout wraps around all pages and includes the Navbar and Footer
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {/* <Navbar/> */}
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  );
}