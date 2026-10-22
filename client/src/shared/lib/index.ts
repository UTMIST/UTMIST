// src/shared/lib/index.ts — universal platform API (safe in server and client code)
export * from "./auth/types";
export * from "./flags/types";
export * from "./validation";
export { cn } from "./utils";
export * from "./content/types";
export { createFixtureContentReader } from "./content/reader";
