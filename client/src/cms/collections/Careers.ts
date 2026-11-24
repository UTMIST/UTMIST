import type { CollectionConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validateHttpUrl, validateSlug } from "../fields.ts";

export const Careers: CollectionConfig = {
  slug: "careers",
  admin: {
    defaultColumns: ["title", "department", "closesAt", "updatedAt"],
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
    { name: "department", type: "text", required: true },
    { name: "division", type: "text" },
    { name: "description", type: "textarea" },
    {
      name: "applicationUrl",
      type: "text",
      required: true,
      validate: validateHttpUrl,
    },
    { name: "opensAt", type: "date" },
    { name: "closesAt", type: "date" },
  ],
  versions: { drafts: true },
};
