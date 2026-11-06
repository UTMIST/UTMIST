"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

/** Keep the redesigned footer scoped to the flagged homepage, including navigation. */
export function SiteFooter({ redesignEnabled = false }: { redesignEnabled?: boolean }) {
  const pathname = usePathname();
  return <Footer variant={redesignEnabled && pathname === "/" ? "standard" : "legacy"} />;
}
