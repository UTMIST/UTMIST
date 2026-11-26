import type { CollectionConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validateHttpUrl, validateSlug } from "../fields.ts";

export const Startups: CollectionConfig = {
  slug: "startups",
  labels: { singular: "Startup listing", plural: "Startup listings" },
  admin: {
    group: "Content",
    defaultColumns: ["name", "slug", "updatedAt"],
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
    { name: "logo", type: "relationship", relationTo: "media" },
    { name: "website", type: "text", validate: validateHttpUrl },
  ],
  versions: { drafts: true },
};
