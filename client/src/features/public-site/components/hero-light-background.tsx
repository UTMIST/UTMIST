"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { IconButton } from "@/shared/ui";
import { createHeroLightRenderer, heroLightPalettes, type HeroLightRenderer } from "@/features/public-site/lib/hero-light-renderer";
import "@/features/public-site/styles/hero-light-background.css";

const fallbackImages = {
  home: "/home-redesign/hero-background.webp",
  f2f: "/academics-redesign/hero.png",
};

/** Only the backdrop moves; the hero's content stays stationary. */
export default function HeroLightBackground({ theme = "home" }: { theme?: keyof typeof heroLightPalettes }) {
  const [paused, setPaused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<HeroLightRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    if (!canvas || !hero) return;
    rendererRef.current = createHeroLightRenderer(canvas, hero, heroLightPalettes[theme]);
    return () => {
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, [theme]);

  useEffect(() => {
    rendererRef.current?.setPaused(paused);
  }, [paused, theme]);

  function togglePaused() {
    setPaused((value) => !value);
  }

  return (
    <>
      <div className="hero-light-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden" data-paused={paused} data-hero-theme={theme} aria-hidden="true">
        <Image src={fallbackImages[theme]} alt="" fill preload sizes="100vw" className="object-cover" />
        <canvas ref={canvasRef} className="hero-light-canvas absolute inset-0 size-full" />
      </div>
      <IconButton tone="dark"
        onClick={togglePaused}
        aria-label={paused ? "Resume background animation" : "Pause background animation"}
        className="hero-light-motion-toggle absolute bottom-4 right-20 z-10 motion-reduce:hidden">
        {paused ? <Play size={20} aria-hidden="true" /> : <Pause size={20} aria-hidden="true" />}
      </IconButton>
    </>
  );
}
