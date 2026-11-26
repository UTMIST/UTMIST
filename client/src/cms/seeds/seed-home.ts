import type { Payload } from "payload";

import document from "../../features/public-site/data/home-page.json" with { type: "json" };
import { homePagePublishSchema, homePageSchema } from "../../shared/lib/content/home-page.ts";

const homeEventSlugs = {
  eigenai: "eigenai",
  cucai: "cucai",
  ai2: "ai-squared",
  "genai-genesis": "genai-genesis",
} as const;

/** Operator-only Local API helper; callers must validate the database target. */
export async function seedHomePage(payload: Pick<Payload, "find" | "create" | "update">) {
  const existing = await payload.find({
    collection: "pages",
    where: { slug: { equals: document.slug } },
    limit: 1,
    depth: 0,
    draft: true,
    pagination: false,
    overrideAccess: true,
  });
  const home = existing.docs[0];
  if (home?.sections?.length) return "already-exists" as const;

  const legacy = await payload.find({
    collection: "content-sections",
    where: { and: [{ key: { equals: "home-impact" } }, { status: { equals: "published" } }] },
    overrideAccess: false, depth: 0, limit: 1, pagination: false,
  });
  const fallback = homePageSchema.parse(document);
  const events = await Promise.all(fallback.events.items.map(async ({ artwork, category, description, href, imageAlt, title }) => {
    const slug = homeEventSlugs[artwork];
    const matches = await payload.find({
      collection: "events",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      draft: true,
      pagination: false,
      overrideAccess: true,
    });
    const record = matches.docs[0] ?? await payload.create({
      collection: "events",
      data: { title, slug, kind: "program", summary: description, destinationUrl: href, _status: "published" },
    });
    return { artwork, category, imageAlt, event: record.id };
  }));
  const impact = legacy.docs[0];
  const { sections } = homePagePublishSchema.parse({
    sections: [
      fallback.hero,
      fallback.about,
      impact ? { ...fallback.impact, heading: impact.heading, description: impact.description, statistics: impact.statistics } : fallback.impact,
      fallback.mission,
      fallback.sponsors,
      { ...fallback.events, items: events },
      fallback.startups,
      fallback.faq,
    ],
  });

  if (home) {
    await payload.update({
      collection: "pages", id: home.id, data: { sections }, draft: true, overrideAccess: true,
    });
    return "added-to-existing" as const;
  }

  await payload.create({
    collection: "pages",
    data: {
      title: document.title,
      slug: document.slug,
      template: "home",
      introduction: { heading: fallback.about.heading, description: fallback.about.description },
      sections,
    },
    draft: true,
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
