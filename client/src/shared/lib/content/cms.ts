import "server-only";

import { connection } from "next/server";

import { evaluateFlag } from "../flags/server";
import { payloadContentReader } from "./payload";
import { contentOrThrow } from "./reader";
import type { ContentDefinition } from "./types";

interface CmsContentOptions<T> {
  definition: ContentDefinition<T>;
  fallback: T;
}

/**
 * Select the standard CMS-backed content source.
 *
 * Local development and Vercel Preview may opt in through `CMS-Access`.
 * Production and every other environment always retain the supplied fallback.
 * Eligible requests stay dynamic so flag changes and published edits are
 * observed without rebuilding or redeploying.
 */
export async function readCmsContent<T>({
  definition,
  fallback,
}: CmsContentOptions<T>): Promise<T> {
  const isLocalDevelopment =
    process.env.NODE_ENV === "development" &&
    !process.env.VERCEL &&
    !process.env.VERCEL_ENV;
  const isHostedPreview = process.env.VERCEL_ENV === "preview";

  if (!isLocalDevelopment && !isHostedPreview) return fallback;

  await connection();
  if (!(await evaluateFlag("CMS-Access"))) return fallback;

  return contentOrThrow(await payloadContentReader.read(definition));
}
