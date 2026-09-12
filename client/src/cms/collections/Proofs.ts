import type { CollectionConfig } from "payload";

const isAuthenticated: NonNullable<CollectionConfig["access"]>["create"] = ({
  req,
}) => Boolean(req.user);

export const Proofs: CollectionConfig = {
  slug: "proofs",
  labels: {
    singular: "CMS proof",
    plural: "CMS proofs",
  },
  admin: {
    defaultColumns: ["title", "status", "updatedAt"],
    useAsTitle: "title",
  },
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      required: true,
    },
  ],
};
