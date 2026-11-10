import "server-only";
import { connection } from "next/server";
import { contentOrThrow, evaluateFlag, payloadAcademicsReader } from "@/shared/lib/server";
import { academicsContent, academicsDefinition } from "@/features/public-site/data/academics";

/** Follow the existing local content-source policy until hosted acceptance in #495. */
export async function readAcademics() {
  if (process.env.NODE_ENV !== "development" || process.env.VERCEL || process.env.VERCEL_ENV) {
    return academicsContent;
  }
  if (!(await evaluateFlag("CMS-Access"))) return academicsContent;
  await connection();
  return contentOrThrow(await payloadAcademicsReader.read(academicsDefinition));
}
