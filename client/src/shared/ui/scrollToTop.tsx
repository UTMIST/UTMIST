"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

import upArrow from "@/assets/icons/arrow-up.webp";
import { Button } from "./button";
import { IconButton } from "./icon-button";

export default function ScrollToTop({ redesignEnabled = false }: { redesignEnabled?: boolean }) {
  const pathname = usePathname();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  if (redesignEnabled && pathname === "/") {
    return <IconButton aria-label="Scroll to top" tone="light" onClick={scrollToTop}
      data-appearance="standard" className="scroll-to-top fixed bottom-4 right-4 z-20 shadow-sm">
      <ArrowUp aria-hidden="true" />
    </IconButton>;
  }
  return (
    <Button type="button" variant="ghost" size="icon" aria-label="Scroll to top"
      data-appearance="legacy" className="scroll-to-top p-0 hover:scale-100"
      onClick={scrollToTop}
    >
      <Image
        src={upArrow}
        alt=""
        width={24}
        height={24}
      />
    </Button>
  );
}
