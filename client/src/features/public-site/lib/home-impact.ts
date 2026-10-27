import "server-only";

import { connection } from "next/server";

import { contentOrThrow, evaluateFlag, payloadContentReader } from "@/shared/lib/server";
import { homeImpactContent, homeImpactDefinition } from "@/features/public-site/data/home-impact";

/** Hosted CMS source selection belongs to #495. This proof is local-only. */
export async function readHomeImpact() {
  if (process.env.NODE_ENV !== "development" || process.env.VERCEL || process.env.VERCEL_ENV) {
    return homeImpactContent;
  }
  if (!(await evaluateFlag("CMS-Access"))) return homeImpactContent;

  // Opted-in local reads must never be prerendered or use the route cache.
  await connection();
  return contentOrThrow(await payloadContentReader.read(homeImpactDefinition));
}
