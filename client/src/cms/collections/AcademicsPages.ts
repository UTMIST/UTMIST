import type { Access, CollectionConfig, Field, TextField, TextareaField, TextFieldSingleValidation } from "payload";
import type { z } from "zod";
// Payload's Node 24 CLI needs a native ESM path to the same shared barrel.
import {
  academicsTextSchema, academicsOptionalTextSchema, academicsOptionalLinkSchema,
  academicsImageSchema, academicsOptionalImageSchema, academicsDateSchema,
} from "../../shared/lib/index.ts";

const isEditor: Access = ({ req }) => req.user?.collection === "cms-users";
const validateWith = (schema: z.ZodTypeAny) => (value: unknown) => {
  const result = schema.safeParse(value);
  return result.success || result.error.issues[0].message;
};
const text = (name: string, multiline = false): TextField | TextareaField => {
  const options = { name, required: true, validate: validateWith(academicsTextSchema) };
  return multiline ? { ...options, type: "textarea" } : { ...options, type: "text" };
};
const validateFaqLabel: TextFieldSingleValidation = (value, { siblingData }) => {
  if (siblingData && "href" in siblingData && typeof siblingData.href === "string" && siblingData.href.trim()) {
    return validateWith(academicsTextSchema)(value);
  }
  return validateWith(academicsOptionalTextSchema)(value);
};
const notice = (name: string): Field => ({ name, type: "textarea", validate: validateWith(academicsOptionalTextSchema) });
const link = (name: string): Field => ({
  name, type: "text", validate: validateWith(academicsOptionalLinkSchema),
  admin: { description: "Site path or HTTPS URL. Leave empty when unavailable." },
});
const sessionFields = (): Field[] => [
  text("title"),
  { name: "track", type: "select", required: true, options: ["Foundations", "Frontiers"] },
  text("description", true),
  { ...text("date"), label: "Date display", admin: { description: "For example: October 13, 2026, or Date to be announced." } },
  { name: "dateTime", label: "Machine-readable date", type: "text", validate: validateWith(academicsDateSchema), admin: { description: "Optional YYYY-MM-DD; clear this when the date is unconfirmed." } },
  text("time"), text("location"),
  { name: "resources", type: "group", fields: [link("slides"), link("recording"), link("code")] },
];

export const AcademicsPages: CollectionConfig = {
  slug: "academics-pages",
  labels: { singular: "Academics page", plural: "Academics pages" },
  admin: {
    useAsTitle: "key", defaultColumns: ["key", "_status", "updatedAt"],
    description: "Manage F2F copy, workshops, FAQs and team profiles. Save Draft keeps the published page unchanged; Publish makes your changes available.",
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: {
    create: isEditor, update: isEditor, delete: isEditor, readVersions: isEditor,
    read: ({ req }) => req.user?.collection === "cms-users" || { _status: { equals: "published" } },
  },
  fields: [
    {
      name: "key", type: "select", required: true, unique: true, defaultValue: "f2f",
      options: [{ label: "Foundations to Frontiers", value: "f2f" }],
      admin: { description: "Connects this document to /ml-fundamentals. Only one F2F document is needed." },
    },
    { type: "tabs", tabs: [
      { label: "Page copy", fields: [
        { name: "hero", type: "group", fields: [text("eyebrow"), text("title"), text("titleContinuation"), text("exploreLabel"), text("archiveLabel")] },
        { name: "introduction", type: "group", fields: [
          text("heading"), text("description", true), text("foundationsDescription", true), text("frontiersDescription", true),
          { name: "image", type: "text", required: true, validate: validateWith(academicsImageSchema), admin: { description: "Local image path or public Supabase Storage URL; this CMS does not upload files." } },
          text("imageAlt"),
        ] },
      ] },
      { label: "Workshops", fields: [
        { name: "workshops", type: "group", fields: [text("heading"), text("description", true), notice("notice")] },
        { name: "kickoff", label: "Kick-off session", type: "group", fields: sessionFields() },
        { name: "topics", type: "array", required: true, minRows: 1, admin: { description: "Drag topics and sessions into their display order." }, fields: [
          text("label"), text("title"),
          { name: "sessions", type: "array", required: true, minRows: 1, fields: sessionFields() },
        ] },
      ] },
      { label: "FAQs", fields: [
        text("faqHeading"),
        { name: "faqs", type: "array", required: true, minRows: 1, fields: [
          text("question"), text("answer", true), link("href"),
          { name: "linkLabel", type: "text", validate: validateFaqLabel },
        ] },
      ] },
      { label: "Team", fields: [
        text("teamHeading"), notice("teamNotice"),
        { name: "team", type: "array", required: true, minRows: 1, fields: [
          text("name"), text("role"),
          { name: "image", type: "text", validate: validateWith(academicsOptionalImageSchema), admin: { description: "Local image path or public Supabase Storage URL. Empty uses the placeholder portrait." } },
          { name: "isDirector", label: "Show director badge", type: "checkbox", defaultValue: false },
        ] },
      ] },
    ] },
  ],
};
