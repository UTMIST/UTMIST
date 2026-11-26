import type { CollectionConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validateHttpUrl, validateSlug } from "../fields.ts";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    group: "Content",
    defaultColumns: ["name", "category", "updatedAt"],
    useAsTitle: "name",
  },
  access: {
    create: isCmsEditor,
    delete: isCmsEditor,
    read: publishedOrCmsEditor,
    readVersions: isCmsEditor,
    update: isCmsEditor,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      validate: validateSlug,
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "AI applications", value: "aiapps" },
        { label: "Computer vision", value: "cvpr" },
        { label: "Financial ML", value: "finml" },
        { label: "Generative AI", value: "genai" },
        { label: "Medical AI", value: "medai" },
        { label: "ML health", value: "mlhealth" },
        { label: "ML operations", value: "mlops" },
        { label: "ML research", value: "mlresearch" },
        { label: "Reinforcement learning", value: "mlrl" },
        { label: "Natural language processing", value: "nlp" },
        { label: "Supervised learning", value: "supvlr" },
      ],
    },
    { name: "image", type: "relationship", relationTo: "media" },
    { name: "repositoryUrl", type: "text", validate: validateHttpUrl },
    { name: "destinationUrl", type: "text", validate: validateHttpUrl },
  ],
  versions: { drafts: true },
};
