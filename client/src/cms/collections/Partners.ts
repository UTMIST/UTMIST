import type { CollectionConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validateHttpUrl, validateSlug } from "../fields.ts";

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: { singular: "Sponsor or partner", plural: "Sponsors and partners" },
  admin: {
    group: "Sponsorship",
    defaultColumns: ["name", "showOnHome", "_status"],
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
    {
      name: "showOnHome",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Include this published partner in Home → Supported By. Add a website and a published image." },
    },
  ],
  versions: { drafts: true },
};
