import type { Metadata } from "next";
import "./globals.css";
import { Roboto, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Importing fonts from Google Fonts
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-spce-grotesk",
  subsets: ["latin"],
});

//Metadata for the page
export const metadata: Metadata = {
  title: "UTMIST (University of Toronto Machine Intelligence Student Team)",
  description: "UTMIST - Largest AI and ML student org in Canada",
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
      <body className={`${roboto.className} ${spaceGrotesk.className}`}>
      <Navbar/>
      <main>{children}</main>
      <Footer/>
      </body>
    </html>
  );
}
