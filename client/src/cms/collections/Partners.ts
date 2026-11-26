import type { CollectionConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validateHttpUrl, validateSlug } from "../fields.ts";

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: { singular: "Sponsor or partner", plural: "Sponsors and partners" },
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
    { name: "website", type: "text", validate: validateHttpUrl },
    { name: "logo", type: "relationship", relationTo: "media" },
  ],
  versions: { drafts: true },
};
