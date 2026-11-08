import "server-only";

import { connection } from "next/server";

import { contentOrThrow, evaluateFlag, payloadContentReader } from "@/shared/lib/server";
import { homeImpactContent, homeImpactDefinition } from "@/features/public-site/data/home-impact";

/** Use hosted CMS content only in Preview, or in explicitly opted-in local development. */
export async function readHomeImpact() {
  const isLocalDevelopment =
    process.env.NODE_ENV === "development" &&
    !process.env.VERCEL &&
    !process.env.VERCEL_ENV;
  const isHostedPreview = process.env.VERCEL_ENV === "preview";

  if (!isLocalDevelopment && !isHostedPreview) {
    return homeImpactContent;
  }

  // Preview flag changes and CMS edits must be visible on a later request without
  // rebuilding. Opting into either eligible environment therefore makes the page
  // dynamic even while CMS access is Off.
  await connection();
  if (!(await evaluateFlag("CMS-Access"))) return homeImpactContent;

  return contentOrThrow(await payloadContentReader.read(homeImpactDefinition));
}
