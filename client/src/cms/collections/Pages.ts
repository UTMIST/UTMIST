import type { Access, Block, CollectionConfig } from "payload";

import { ctaField, introFields, linkFields, textField, validateContentLink } from "../page-fields.ts";
import { sponsorAssetOptions } from "../page-assets.ts";
import { homePageSchema } from "../../shared/lib/content/home-page.ts";

const isEditor: Access = ({ req }) => req.user?.collection === "cms-users";

const blocks: Block[] = [
  {
    slug: "hero",
    fields: [
      textField("eyebrow"), textField("heading", true), textField("description", true),
      { name: "links", type: "array", required: true, minRows: 1, fields: linkFields },
    ],
  },
  {
    slug: "about",
    fields: [
      ...introFields, ctaField,
      textField("imageAlt"), textField("caption"),
    ],
  },
  {
    slug: "impact",
    fields: [
      textField("heading"),
      { name: "description", type: "textarea" },
      {
        name: "statistics", type: "array", required: true, minRows: 1,
        fields: [
          {
            name: "number", type: "text", required: true,
            validate: (value: unknown) => (typeof value === "string" && /^\d{1,9}\+?$/.test(value)) || "Use up to 9 digits with an optional +",
          },
          textField("description"),
        ],
      },
    ],
  },
  { slug: "mission", fields: [...introFields, ctaField] },
  {
    slug: "sponsors",
    fields: [
      ...introFields, ctaField,
      {
        name: "items", type: "array", required: true, minRows: 1,
        fields: [
          { name: "asset", type: "select", required: true, options: [...sponsorAssetOptions] },
          textField("alt"),
          { name: "href", type: "text", required: true, validate: validateContentLink },
        ],
      },
    ],
  },
  {
    slug: "events",
    fields: [
      ...introFields, textField("communityStatement", true), textField("listHeading"),
      {
        name: "items", type: "array", required: true, minRows: 1,
        fields: [
          textField("title"), textField("description", true), textField("category"),
          { name: "href", type: "text", required: true, validate: validateContentLink },
          {
            name: "artwork", type: "select", required: true,
            options: [
              { label: "EigenAI artwork", value: "eigenai" },
              { label: "CUCAI conference", value: "cucai" },
              { label: "AI Squared cube", value: "ai2" },
              { label: "GenAI group photo", value: "genai-genesis" },
            ],
          },
          { name: "imageAlt", type: "text", admin: { description: "Leave empty for decorative artwork." } },
        ],
      },
    ],
  },
  {
    slug: "startups",
    fields: [
      ...introFields, ctaField,
      { name: "benefits", type: "array", required: true, minRows: 1, fields: [textField("title"), textField("description", true)] },
    ],
  },
  {
    slug: "faq",
    labels: { singular: "FAQ", plural: "FAQs" },
    fields: [
      textField("eyebrow"), textField("heading"),
      { name: "items", type: "array", required: true, minRows: 1, fields: [textField("question"), textField("answer", true)] },
    ],
  },
];

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status"],
    description: "Edit the homepage together. Publish to update the CMS-enabled Preview; Save Draft keeps the published page live.",
  },
  versions: { drafts: true },
  access: {
    create: isEditor,
    update: isEditor,
    delete: isEditor,
    readVersions: isEditor,
    read: ({ req }) => req.user?.collection === "cms-users" || { _status: { equals: "published" } },
  },
  fields: [
    textField("title"),
    {
      name: "slug", type: "text", required: true, unique: true,
      admin: { description: "Stable page identifier, e.g. home. Coordinate changes with the page adapter." },
      validate: (value: unknown) => (typeof value === "string" && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value)) || "Use a lowercase kebab-case identifier",
    },
    {
      name: "sections", type: "blocks", required: true, minRows: 1, blocks,
      admin: { initCollapsed: true },
      validate: (value, { data }) => {
        if (!data || !("slug" in data) || data.slug !== "home") return true;
        const result = homePageSchema.safeParse({ sections: value });
        return result.success || result.error.issues.map(issue => issue.message).join("; ");
      },
    },
  ],
};
