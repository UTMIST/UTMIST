import "server-only";

import { createContentReader } from "./reader";

/**
 * Lazy initialization keeps static/disabled consumers independent of Payload.
 * Public reads deliberately have no editor context and never override access.
 * Payload may reuse its connection pool; every read queries Postgres anew.
 */
export const payloadContentReader = createContentReader(async (key) => {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import("payload"),
    import("@payload-config"),
  ]);
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "content-sections",
    where: { and: [{ key: { equals: key } }, { status: { equals: "published" } }] },
    overrideAccess: false,
    depth: 0,
    limit: 1,
    pagination: false,
  });
  return result.docs[0] ?? null;
});
