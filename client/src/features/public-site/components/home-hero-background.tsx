"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { IconButton } from "@/shared/ui";
import { createHeroLightRenderer, type HeroLightRenderer } from "@/features/public-site/lib/hero-light-renderer";

/** Only the backdrop moves; the hero's content stays stationary. */
export default function HomeHeroBackground() {
  const [paused, setPaused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<HeroLightRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    if (!canvas || !hero) return;
    rendererRef.current = createHeroLightRenderer(canvas, hero);
    return () => {
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, []);

  function togglePaused() {
    const next = !paused;
    rendererRef.current?.setPaused(next);
    setPaused(next);
  }

  return (
    <>
      <div className="home-hero-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden" data-paused={paused} aria-hidden="true">
        <Image src="/home-redesign/hero-background.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        <canvas ref={canvasRef} className="home-hero-canvas absolute inset-0 size-full" />
      </div>
      <IconButton tone="dark"
        onClick={togglePaused}
        aria-label={paused ? "Resume background animation" : "Pause background animation"}
        className="home-hero-motion-toggle absolute bottom-4 right-20 z-10 motion-reduce:hidden">
        {paused ? <Play size={20} aria-hidden="true" /> : <Pause size={20} aria-hidden="true" />}
      </IconButton>
    </>
  );
}
