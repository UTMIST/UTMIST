import { contentKeySchema } from "./types";
import type { ContentReader, ContentResult } from "./types";

/** Share validation and result semantics between the real and fixture adapters. */
export function createContentReader(
  findPublished: (key: string) => Promise<unknown | null>,
): ContentReader {
  return {
    async read({ key, schema }) {
      if (!contentKeySchema.safeParse(key).success) {
        return { status: "error", reason: "invalid-key" };
      }
      try {
        const document = await findPublished(key);
        if (document == null) return { status: "missing" };
        const result = schema.safeParse(document);
        return result.success
          ? { status: "found", content: result.data }
          : { status: "error", reason: "invalid-content" };
      } catch {
        // Never expose database errors, connection strings, or raw CMS documents.
        return { status: "error", reason: "unavailable" };
      }
    },
  };
}

/** Explicit offline example/test adapter. Never selected as a runtime fallback. */
export function createFixtureContentReader(
  documents: readonly { key: string; status: "draft" | "published"; [field: string]: unknown }[],
): ContentReader {
  return createContentReader(async (key) =>
    documents.find((document) => document.key === key && document.status === "published") ?? null,
  );
}

/** Require content explicitly; missing/error results never become fixture data. */
export function contentOrThrow<T>(result: ContentResult<T>): T {
  if (result.status === "found") return result.content;
  throw new Error(`CMS content ${result.status === "missing" ? "missing" : result.reason}`);
}
