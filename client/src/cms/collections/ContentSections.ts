import type { Access, CollectionConfig } from "payload";

const isEditor: Access = ({ req }) => req.user?.collection === "cms-users";

export const ContentSections: CollectionConfig = {
  slug: "content-sections",
  admin: { useAsTitle: "key", defaultColumns: ["key", "heading", "status", "updatedAt"] },
  access: {
    create: isEditor,
    update: isEditor,
    delete: isEditor,
    read: ({ req }) => req.user?.collection === "cms-users" || { status: { equals: "published" } },
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "Stable identifier used by code, e.g. home-impact. Do not rename a connected section." },
      validate: (value: unknown) => (typeof value === "string" && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value)) || "Use a lowercase kebab-case identifier",
    },
    { name: "heading", type: "text", required: true },
    { name: "description", type: "textarea" },
    {
      name: "statistics",
      type: "array",
      admin: { description: "Required for home-impact; rows display in this order." },
      fields: [
        {
          name: "number",
          type: "text",
          required: true,
          validate: (value: unknown) => (typeof value === "string" && /^\d{1,9}\+?$/.test(value)) || "Use up to 9 digits with an optional +",
        },
        { name: "description", type: "text", required: true },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [{ label: "Draft", value: "draft" }, { label: "Published", value: "published" }],
    },
  ],
};
