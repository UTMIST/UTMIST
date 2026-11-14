// src/shared/lib/index.ts — universal platform API (safe in server and client code)
export * from "./auth/types.ts";
export * from "./flags/types.ts";
export * from "./validation.ts";
export { cn } from "./utils.ts";
export * from "./content/types.ts";
export * from "./content/academics.ts";
export { createFixtureContentReader } from "./content/reader.ts";
