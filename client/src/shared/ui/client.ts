// src/shared/ui/client.ts — client-only chrome barrel.
// These components are "use client" and pull browser-only dependency graphs:
// Navbar reaches @/shared/lib/client (supabase-js → ESM-only `isows`),
// select/dropdown pull @radix-ui/react-select + lucide-react, and the theme
// components pull next-themes. Server-safe primitives live in ./index.ts
// (import from "@/shared/ui") so server pages never trace this graph.
export * from "./select";
export * from "./dropdown";

export { default as Navbar } from "./navbar";
export { ThemeProvider } from "./theme-provider";
export { ThemeToggle } from "./theme-toggle";
export { FloatingThemeToggle } from "./floating-theme-toggle";
export { default as ScrollToTop } from "./scrollToTop";
