import type { CollectionConfig } from "payload";

import { homePagePublishSchema } from "../../shared/lib/content/home-page.ts";
import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import { validateSlug } from "../fields.ts";
import { homeSections } from "../home-sections.ts";

const pageTemplates = [
  "home",
  "departments",
  "sponsors",
  "projects",
  "blog",
  "startups",
  "careers",
  "events",
  "ai2",
  "eigenai",
  "ml-fundamentals",
].map((value) => ({ label: value, value }));

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    group: "Website",
    defaultColumns: ["title", "slug", "template", "updatedAt"],
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
      admin: { description: "Use home for the root route." },
      validate: validateSlug,
    },
    {
      name: "template",
      type: "select",
      required: true,
      unique: true,
      options: pageTemplates,
    },
    {
      name: "sections",
      type: "blocks",
      blocks: homeSections,
      admin: { condition: (_, siblingData) => siblingData.template === "home", initCollapsed: true },
      validate: (value, { data }) => {
        const isHome = data && (
          ("template" in data && data.template === "home") || ("slug" in data && data.slug === "home")
        );
        if (!isHome) return true;
        const result = homePagePublishSchema.safeParse({ sections: value });
        return result.success || result.error.issues.map(issue => issue.message).join(". ");
      },
    },
    {
      name: "introduction",
      type: "group",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "faq",
      type: "array",
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
    {
      name: "featuredEvents",
      type: "relationship",
      relationTo: "events",
      hasMany: true,
    },
    {
      name: "featuredProjects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
    },
    {
      name: "featuredPosts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
    },
    {
      name: "careerListings",
      type: "relationship",
      relationTo: "careers",
      hasMany: true,
    },
    {
      name: "startupListings",
      type: "relationship",
      relationTo: "startups",
      hasMany: true,
    },
    {
      name: "partners",
      type: "array",
      fields: [
        {
          name: "partner",
          type: "relationship",
          relationTo: "partners",
          required: true,
        },
        {
          name: "context",
          type: "text",
          admin: { description: "For example, sponsorship package or tier." },
        },
      ],
    },
    {
      name: "sponsorshipPackages",
      type: "array",
      admin: { condition: (_, siblingData) => siblingData.template === "sponsors" },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "price", type: "number", required: true, min: 0 },
        {
          name: "benefits",
          type: "array",
          fields: [{ name: "benefit", type: "text", required: true }],
        },
      ],
    },
    {
      name: "people",
      type: "array",
      fields: [
        {
          name: "person",
          type: "relationship",
          relationTo: "people",
          required: true,
        },
        { name: "role", type: "text", required: true },
      ],
    },
    {
      name: "metadata",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "image", type: "relationship", relationTo: "media" },
      ],
    },
  ],
  versions: { drafts: true },
};
