import { z } from "zod";

export const academicsTextSchema = z.string().trim().min(1, "Enter a value");
export const academicsOptionalTextSchema = z.string().trim().nullish().transform((value) => value || undefined);

/** Navigation accepts site paths or HTTPS, never executable/protocol-relative URLs. */
export const academicsLinkSchema = academicsTextSchema.refine((value) => {
  if (/^\/(?!\/)[^\s\\]*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}, "Use a site path starting with / or an HTTPS URL");

/** Match the existing Next Image host policy; uploads require a separate storage adapter. */
export const academicsImageSchema = academicsTextSchema.refine((value) => {
  if (/^\/(?!\/)[^\s\\?#]+\.(?:png|jpe?g|webp|avif|gif)$/i.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /^[a-z0-9-]+\.supabase\.co$/.test(url.hostname)
      && !url.port && !url.username && !url.password
      && url.pathname.startsWith("/storage/v1/object/public/");
  } catch { return false; }
}, "Use a local image path or a public Supabase Storage image URL");

const optionalValue = <T extends z.ZodTypeAny>(schema: T) => z.preprocess(
  (value) => value == null || (typeof value === "string" && !value.trim()) ? undefined : value,
  schema.optional(),
);

export const academicsOptionalLinkSchema = optionalValue(academicsLinkSchema);
export const academicsOptionalImageSchema = optionalValue(academicsImageSchema);
export const academicsDateSchema = optionalValue(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(
  (value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Use a valid date in YYYY-MM-DD format",
));

export const academicSessionSchema = z.object({
  id: academicsTextSchema.default("kickoff"),
  title: academicsTextSchema,
  track: z.enum(["Foundations", "Frontiers"]),
  description: academicsTextSchema,
  date: academicsTextSchema,
  dateTime: academicsDateSchema,
  time: academicsTextSchema,
  location: academicsTextSchema,
  resources: z.object({
    slides: academicsOptionalLinkSchema,
    recording: academicsOptionalLinkSchema,
    code: academicsOptionalLinkSchema,
  }).nullish().transform((value) => value ?? {}),
});

export const academicsFaqSchema = z.object({
  id: academicsTextSchema,
  question: academicsTextSchema,
  answer: academicsTextSchema,
  href: academicsOptionalLinkSchema,
  linkLabel: academicsOptionalTextSchema,
}).refine((value) => !value.href || Boolean(value.linkLabel), {
  path: ["linkLabel"], message: "Give the link a label",
});

export const academicsContentSchema = z.object({
  hero: z.object({
    eyebrow: academicsTextSchema,
    title: academicsTextSchema,
    titleContinuation: academicsTextSchema,
    exploreLabel: academicsTextSchema,
    archiveLabel: academicsTextSchema,
  }),
  introduction: z.object({
    heading: academicsTextSchema,
    description: academicsTextSchema,
    foundationsDescription: academicsTextSchema,
    frontiersDescription: academicsTextSchema,
    image: academicsImageSchema,
    imageAlt: academicsTextSchema,
  }),
  workshops: z.object({
    heading: academicsTextSchema,
    description: academicsTextSchema,
    notice: academicsOptionalTextSchema,
  }),
  kickoff: academicSessionSchema,
  topics: z.array(z.object({
    id: academicsTextSchema,
    label: academicsTextSchema,
    title: academicsTextSchema,
    sessions: z.array(academicSessionSchema).min(1),
  })).min(1),
  faqHeading: academicsTextSchema,
  faqs: z.array(academicsFaqSchema).min(1),
  teamHeading: academicsTextSchema,
  teamNotice: academicsOptionalTextSchema,
  team: z.array(z.object({
    id: academicsTextSchema,
    name: academicsTextSchema,
    role: academicsTextSchema,
    image: academicsOptionalImageSchema,
    isDirector: z.boolean().nullish().transform((value) => value ?? false),
  })).min(1),
});

export type AcademicSession = z.infer<typeof academicSessionSchema>;
export type AcademicsContent = z.infer<typeof academicsContentSchema>;
