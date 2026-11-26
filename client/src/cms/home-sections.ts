import type { Block } from "payload";

import { ctaField, introFields, linkFields, textField } from "./page-fields.ts";

export const homeSections: Block[] = [
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
    fields: [...introFields, ctaField],
  },
  {
    slug: "events",
    fields: [
      ...introFields, textField("communityStatement", true), textField("listHeading"),
      {
        name: "items", type: "array", required: true, minRows: 1,
        fields: [
          { name: "event", type: "relationship", relationTo: "events", required: true },
          textField("category"),
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
