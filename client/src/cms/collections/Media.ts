import type { CollectionConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validatePublicAsset } from "../fields.ts";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Website",
    defaultColumns: ["title", "kind", "source", "updatedAt"],
    useAsTitle: "title",
  },
  access: {
    create: isCmsEditor,
    delete: isCmsEditor,
    read: publishedOrCmsEditor,
    readVersions: isCmsEditor,
    update: isCmsEditor,
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "kind",
      type: "select",
      required: true,
      options: [
        { label: "Image", value: "image" },
        { label: "Document / PDF", value: "document" },
      ],
    },
    {
      name: "source",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "A repository public path or HTTPS URL. File uploads wait for durable storage work.",
      },
      validate: validatePublicAsset,
    },
    {
      name: "altText",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData.kind === "image" },
    },
  ],
  versions: { drafts: true },
};
