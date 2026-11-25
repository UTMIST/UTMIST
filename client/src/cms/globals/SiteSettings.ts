import type { GlobalConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import {
  validateRequiredHttpUrl,
  validateRequiredSiteUrl,
} from "../fields.ts";

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
          validate: validateRequiredSiteUrl,
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
          validate: validateRequiredHttpUrl,
        },
      ],
    },
    { name: "footerText", type: "textarea", required: true },
  ],
  versions: { drafts: true },
};
