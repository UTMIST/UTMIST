import type { Payload } from "payload";

import document from "../../features/public-site/data/home-page.json" with { type: "json" };
import { homePageSchema } from "../../shared/lib/content/home-page.ts";

/** Operator-only Local API helper; callers must validate the database target. */
export async function seedHomePage(payload: Pick<Payload, "find" | "create">) {
  const existing = await payload.find({
    collection: "pages",
    where: { slug: { equals: document.slug } },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  if (existing.docs.length > 0) return "already-exists" as const;

  const legacy = await payload.find({
    collection: "content-sections",
    where: { and: [{ key: { equals: "home-impact" } }, { status: { equals: "published" } }] },
    overrideAccess: false, depth: 0, limit: 1, pagination: false,
  });
  // Preserve already-published CMS edits during the section-to-page transfer.
  const impact = legacy.docs[0];
  const content = homePageSchema.parse({ ...document, sections: document.sections.map(section =>
    section.blockType === "impact" && impact
      ? { ...section, heading: impact.heading, description: impact.description, statistics: impact.statistics }
      : section,
  ) });
  await payload.create({
    collection: "pages",
    data: { title: document.title, slug: document.slug, sections: Object.values(content), _status: "draft" },
    overrideAccess: true,
  });
  return "created" as const;
}

export function assertLocalSeedTarget(uri: string | undefined, vercel: string | undefined) {
  let target: URL;
  try {
    target = new URL(uri ?? "");
  } catch {
    throw new Error("Set PAYLOAD_DATABASE_URI to a disposable local Postgres database before seeding.");
  }
  if (
    vercel ||
    !["postgres:", "postgresql:"].includes(target.protocol) ||
    !["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) ||
    target.search || target.hash
  ) {
    throw new Error("The homepage seed command only accepts standalone loopback Postgres without query parameters.");
  }
}

/** An explicit operator import may target the shared testing branch, never Production. */
export function assertTestingSeedTarget(uri: string | undefined, vercel: string | undefined) {
  let target: URL;
  try { target = new URL(uri ?? ""); } catch { throw new Error("Invalid testing database target"); }
  if (
    vercel || !["postgres:", "postgresql:"].includes(target.protocol) ||
    target.hostname !== "aws-0-us-east-2.pooler.supabase.com" || target.port !== "5432" ||
    target.username !== "utmist_payload.lrbvknlviodxhhuautfi" || target.pathname !== "/postgres" ||
    target.hash || [...target.searchParams].some(([key, value]) => key !== "sslmode" || !["require", "verify-full"].includes(value))
  ) throw new Error("Testing import requires the scoped CMS login for the shared testing branch.");
}
