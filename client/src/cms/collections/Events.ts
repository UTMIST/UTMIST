import type { CollectionConfig } from "payload";

import { isCmsEditor, publishedOrCmsEditor } from "../access.ts";
import {
  validateRecordDestination,
  validateRecordWebsite,
  validateRequiredHttpUrl,
  validateSlug,
} from "../fields.ts";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    group: "Events",
    defaultColumns: ["title", "kind", "startsAt", "dateLabel", "updatedAt"],
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
    {
      name: "kind",
      type: "select",
      required: true,
      options: [
        { label: "Dated event", value: "event" },
        { label: "Workshop / reading group", value: "workshop" },
        { label: "Ongoing program", value: "program" },
      ],
    },
    { name: "summary", type: "textarea", required: true },
    { name: "startsAt", type: "date" },
    { name: "endsAt", type: "date" },
    {
      name: "dateLabel",
      type: "text",
      admin: {
        description:
          "Displayed when the source does not provide a machine-readable date.",
      },
    },
    { name: "venue", type: "text" },
    { name: "registrationUrl", type: "text", validate: validateRecordWebsite },
    { name: "destinationUrl", type: "text", validate: validateRecordDestination },
    { name: "instructor", type: "text" },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "learningGoals",
      type: "array",
      fields: [{ name: "goal", type: "textarea", required: true }],
    },
    {
      name: "resources",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "url",
          type: "text",
          required: true,
          validate: validateRequiredHttpUrl,
        },
      ],
    },
    {
      name: "speakers",
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
      name: "sponsors",
      type: "array",
      fields: [
        {
          name: "partner",
          type: "relationship",
          relationTo: "partners",
          required: true,
        },
        { name: "tier", type: "text" },
      ],
    },
    {
      name: "schedule",
      type: "array",
      fields: [
        { name: "time", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
    },
  ],
  versions: { drafts: true },
};
