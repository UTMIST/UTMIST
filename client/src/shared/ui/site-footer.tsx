"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

/** Route-specific footers follow the same flag decision as their page. */
export function SiteFooter({ redesignEnabled = false }: { redesignEnabled?: boolean }) {
  const pathname = usePathname();
  const variant = !redesignEnabled ? "legacy"
    : pathname === "/ml-fundamentals" ? "academics"
      : pathname === "/" ? "standard" : "legacy";
  return <Footer variant={variant} />;
}
