"use client";

import React from "react";
import upArrow from "@/assets/icons/arrow-up.webp"
import Image from "next/image";
import "@/app/globals.css"

export default function ScrollToTop() {
  return (
    <div
      className="scroll-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <Image
        src={upArrow}
        alt="Scroll to top"
        width={24}
        height={24}
      />
    </div>
  );
}
