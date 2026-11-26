import type { CollectionConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validateHttpUrl, validateSlug } from "../fields.ts";

export const People: CollectionConfig = {
  slug: "people",
  admin: {
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
    { name: "bio", type: "textarea" },
    {
      name: "photo",
      type: "relationship",
      relationTo: "media",
    },
    { name: "profileUrl", type: "text", validate: validateHttpUrl },
  ],
  versions: { drafts: true },
};
