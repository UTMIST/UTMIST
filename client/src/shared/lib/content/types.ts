import { z } from "zod";

/** Stable, unique CMS identifier; independent of editor-facing copy. */
export const contentKeySchema = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);

export const statisticSchema = z.object({
  number: z.string().regex(/^\d{1,9}\+?$/, "Use an integer with an optional +"),
  description: z.string().trim().min(1),
});

export const contentSectionSchema = z.object({
  heading: z.string().trim().min(1),
  description: z.string().trim().nullish().transform((value) => value || undefined),
  statistics: z.array(statisticSchema).nullish().transform((value) => value ?? undefined),
});

export type Statistic = z.infer<typeof statisticSchema>;
export type ContentSection = z.infer<typeof contentSectionSchema>;

/** A feature supplies its identifier and runtime schema, including required fields. */
export interface ContentDefinition<T> {
  key: string;
  schema: z.ZodType<T, z.ZodTypeDef, unknown>;
}

export type ContentResult<T> =
  | { status: "found"; content: T }
  | { status: "missing" }
  | { status: "error"; reason: "invalid-key" | "invalid-content" | "unavailable" };

/** Reads published content only. No persistence or cross-request content cache. */
export interface ContentReader {
  read<T>(definition: ContentDefinition<T>): Promise<ContentResult<T>>;
}
