import type { Field } from "payload";

import { validateContentLink } from "../shared/lib/content/links.ts";
export { validateContentLink } from "../shared/lib/content/links.ts";

export function textField(name: string, textarea = false): Field {
  const field = {
    name,
    required: true,
    validate: (value: unknown) => (typeof value === "string" && value.trim().length > 0) || "Enter some text",
  };
  return textarea ? { ...field, type: "textarea" } : { ...field, type: "text" };
}

export const linkFields: Field[] = [
  textField("label"),
  { name: "href", type: "text", required: true, validate: validateContentLink },
];

export const introFields: Field[] = [textField("eyebrow"), textField("heading", true), textField("description", true)];
export const ctaField: Field = { name: "cta", type: "group", fields: linkFields };
