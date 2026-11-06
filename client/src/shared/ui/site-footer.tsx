"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

/** Route-specific footers follow the same flag decision as their page. */
export function SiteFooter({ redesignEnabled = false }: { redesignEnabled?: boolean }) {
  const pathname = usePathname();
  const variant = redesignEnabled && (pathname === "/" || pathname === "/ml-fundamentals")
    ? "standard" : "legacy";
  return <Footer variant={variant} />;
}
