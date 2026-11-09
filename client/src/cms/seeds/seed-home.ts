import type { Payload } from "payload";

import { homePageSeed } from "./home.ts";

/** Operator-only Local API helper; callers must validate the database target. */
export async function seedHomePage(payload: Pick<Payload, "find" | "create">) {
  const existing = await payload.find({
    collection: "pages",
    where: { slug: { equals: homePageSeed.slug } },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  if (existing.docs.length > 0) return "already-exists" as const;

  await payload.create({ collection: "pages", data: homePageSeed, overrideAccess: true });
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
