"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { homeMotion } from "@/features/public-site/lib/home-motion";
import { createHomeScrollEffects } from "@/features/public-site/lib/home-scroll-effects";

const motionVariables = {
  "--home-reveal-duration": `${homeMotion.revealMs}ms`,
  "--home-motion-ease": homeMotion.ease,
  "--home-reveal-desktop-distance": `${homeMotion.distance}px`,
  "--home-reveal-mobile-distance": `${homeMotion.mobileDistance}px`,
  "--home-wave-spread": `${homeMotion.waveSpreadMs}ms`,
  "--home-wave-line": `${homeMotion.waveLineMs}ms`,
  "--home-wave-fade": `${homeMotion.waveFadeMs}ms`,
} as CSSProperties;

/** Shared enhancement for the page's server-rendered sections and cards. */
export default function HomeScrollEffects({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (root.current) return createHomeScrollEffects(root.current);
  }, []);

  return <main ref={root} className="home-redesign ui-surface" data-ui-tone="light" data-homepage="redesign" style={motionVariables}>{children}</main>;
}
