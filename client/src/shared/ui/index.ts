// src/shared/ui/index.ts — server-safe design-system primitives.
// Everything here renders in Server Components and imports no client-only
// dependencies (no supabase, no radix popovers, no next-themes/lucide).
// Interactive chrome lives in ./client (import from "@/shared/ui/client").
export * from "./button";
export * from "./input";
export * from "./textarea";

export { default as Footer } from "./footer";
export { default as HeroSection } from "./heroSection";
