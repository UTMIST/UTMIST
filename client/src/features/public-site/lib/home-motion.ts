/** One motion vocabulary for the flagged homepage. Times are in milliseconds. */
export const homeMotion = {
  revealMs: 700,
  staggerMs: 70,
  maxStaggerMs: 420,
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  distance: 16,
  mobileDistance: 8,
  viewportMargin: "0px 0px -48px 0px",
  highlightOffsets: ["start 0.85", "center 0.55"],
  // The hero is already on screen at load; fill during the first 30vh of scrolling.
  heroHighlightOffsets: ["start start", "start -0.3"],
  waveStepMs: 220,
  waveLineMs: 800,
  waveSpreadMs: 1100,
  waveFadeMs: 1200,
} as const;
