import type { GlobalConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validateHttpUrl } from "../fields.ts";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  access: {
    read: publishedOrCmsEditor,
    readVersions: isCmsEditor,
    update: isCmsEditor,
  },
  fields: [
    { name: "contactEmail", type: "email", required: true },
    {
      name: "navigation",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "href",
          type: "text",
          required: true,
          validate: (value: unknown) =>
            (typeof value === "string" && value.startsWith("/")) ||
            validateHttpUrl(value),
        },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "url",
          type: "text",
          required: true,
          validate: validateHttpUrl,
        },
      ],
    },
    { name: "footerText", type: "textarea", required: true },
  ],
  versions: { drafts: true },
};
