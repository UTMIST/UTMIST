"use client";

import React from "react";
import upArrow from "@/assets/icons/arrow-up.webp"
import Image from "next/image";

export default function ScrollToTop() {
  return (
    <button type="button" aria-label="Scroll to top"
      className="scroll-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
    >
      <Image
        src={upArrow}
        alt=""
        width={24}
        height={24}
      />
    </button>
  );
}
