import type { CollectionConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validateHttpUrl, validateSlug } from "../fields.ts";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Article link", plural: "Article links" },
  admin: {
    defaultColumns: ["title", "author", "publishedAt", "updatedAt"],
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
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      validate: validateSlug,
    },
    { name: "author", type: "text", required: true },
    { name: "publishedAt", type: "date", required: true },
    {
      name: "externalUrl",
      type: "text",
      required: true,
      unique: true,
      validate: validateHttpUrl,
    },
    { name: "image", type: "relationship", relationTo: "media" },
  ],
  versions: { drafts: true },
};
