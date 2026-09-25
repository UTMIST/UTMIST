"use client";

import { usePathname } from "next/navigation";

export function HideOnEigenAI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEigenAI =
    pathname === "/eigenai" || pathname.startsWith("/eigenai/");

  return isEigenAI ? null : children;
}
