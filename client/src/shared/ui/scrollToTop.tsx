"use client";

import Image from "next/image";

import upArrow from "@/assets/icons/arrow-up.webp";
import { Button } from "./button";

export default function ScrollToTop() {
  return (
    <Button type="button" variant="ghost" size="icon" aria-label="Scroll to top"
      className="scroll-to-top p-0 hover:scale-100"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
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
