import "server-only";
import { createContentReader } from "./reader";

/** No editor context or draft versions are passed to the public content reader. */
export const payloadAcademicsReader = createContentReader(async (key) => {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import("payload"), import("@payload-config"),
  ]);
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "academics-pages",
    where: { and: [{ key: { equals: key } }, { _status: { equals: "published" } }] },
    draft: false, overrideAccess: false, depth: 0, limit: 1, pagination: false,
  });
  return result.docs[0] ?? null;
});
