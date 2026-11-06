import "server-only";

import { cache } from "react";
import { connection } from "next/server";

import { evaluateFlag } from "./server";

/** One request-scoped decision keeps the page and its navigation together. */
export const isWebRedesignEnabled = cache(async (): Promise<boolean> => {
  // Dashboard changes must take effect without rebuilding a static homepage.
  await connection();
  return evaluateFlag("Web-Redesign");
});
